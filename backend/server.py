import numpy as np
import pandas as pd
from tensorflow import keras
import requests
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout
from keras.optimizers import Adam
from keras.callbacks import EarlyStopping
from keras.layers import BatchNormalization
from keras.regularizers import l2
from pypfopt import risk_models, BlackLittermanModel, EfficientFrontier, expected_returns
from scipy.optimize import minimize
import matplotlib.pyplot as plt
import seaborn as sb
import yfinance as yf
from flask import Flask
from flask_cors import CORS

# TO DO: TURN INTO FLASK / FAST API APP

# Data Preprocessing, Aggregate Sector Returns
# ==========================================================================
response = requests.get("https://en.wikipedia.org/wiki/List_of_S%26P_500_companies", verify=False)
raw = pd.read_html(response.text)
fullDF = pd.DataFrame(raw[0])
tickers = fullDF[['Symbol', 'GICS Sector']]

tickers['Symbol'] = tickers['Symbol'].str.replace('.', '-')
tickers[tickers['Symbol'] == 'BF-B']

sector_breakdown = tickers.groupby('GICS Sector')['Symbol'].apply(list)
sector_breakdown = sector_breakdown.to_dict()

ticker_list = []
for sector in sector_breakdown:
    ticker_list.extend(sector_breakdown[sector])

today = pd.Timestamp.today().strftime('%Y-%m-%d')
month_ago = pd.Timestamp.today() - pd.DateOffset(months=60)

data = yf.download(ticker_list, start=month_ago, end=today)

close_df = data['Close']
close_df.columns = close_df.columns.get_level_values('Ticker')

daily_returns = close_df.pct_change()
daily_returns_filled = daily_returns.ffill().bfill()
daily_returns_final = daily_returns_filled.reset_index()
daily_returns_final.drop('Date', axis = 1)

daily_returns_transposed = daily_returns_final.T
daily_returns_transposed.columns = daily_returns_final.index
daily_returns_transposed['Symbol'] = daily_returns_transposed.index

merged_df = pd.merge(daily_returns_transposed, tickers, on='Symbol')
time_series_cols = daily_returns_final.index.tolist()
numeric_data = merged_df[time_series_cols + ['GICS Sector']]
grouped = numeric_data.groupby('GICS Sector').mean()
sector_returns_final = grouped.T

sector_returns_final = sector_returns_final.apply(pd.to_numeric, errors='coerce')
sector_returns_final = sector_returns_final.dropna()

# Build Neural Network
# ==========================================================================

data = sector_returns_final
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(data)

data = sector_returns_final
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(data)

def create_sequences(data, seq_length):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:i+seq_length])
        y.append(data[i+seq_length])
    return np.array(X), np.array(y)

seq_length = 60

X, y = create_sequences(scaled_data, seq_length)

train_size = int(len(X) * 0.8)
X_train, X_test = X[:train_size], X[train_size:]
y_train, y_test = y[:train_size], y[train_size:]

model = Sequential()
model.add(LSTM(units=30, return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2]), 
               kernel_regularizer=l2(0.01)))
model.add(Dropout(0.3))
model.add(BatchNormalization())
model.add(LSTM(units=30, return_sequences=False, kernel_regularizer=l2(0.01)))
model.add(Dropout(0.3))
model.add(BatchNormalization())
model.add(Dense(units=y_train.shape[1])) 
model.compile(optimizer='adam', loss='mean_squared_error')

early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)

history = model.fit(X_train, y_train, epochs=60, batch_size=32, validation_data=(X_test, y_test), callbacks=[early_stopping])

plt.figure(figsize=(12, 6))
plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title('Model Loss')
plt.ylabel('Loss')
plt.xlabel('Epoch')
plt.legend(loc='upper right')
plt.show()

predictions = model.predict(X_test)
predictions = scaler.inverse_transform(predictions)

mse = np.mean(np.square(predictions - scaler.inverse_transform(y_test)))
print(f'Mean Squared Error on Test Set: {mse}')

pred_df = pd.DataFrame(predictions)
unique_sectors = tickers['GICS Sector'].unique()
pred_df.columns = unique_sectors

mean_returns = []
for sector in pred_df.columns:
    mean_returns.append(pred_df[sector].mean() * 30)
Q = np.array(mean_returns).reshape(-1, 1)

P = np.array([
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
])

view_dict = {}
for sector in pred_df.columns:
    for i in range(0, len(mean_returns)):
        view_dict[sector] = mean_returns[i]
        
cov = sector_returns_final.corr()

bl = BlackLittermanModel(cov_matrix=cov, Q=Q, P=P)
print(bl.optimize())
print(bl.portfolio_performance())