import pandas as pd
import yfinance as yf  # You can use any other financial data API
# Current date in YYYY-MM-DD format
end_date = pd.Timestamp.today().strftime('%Y-%m-%d')

# Start date in YYYY-MM-DD format (5 years ago) using offset
start_date = (pd.Timestamp.today() - pd.DateOffset(years=1)).strftime('%Y-%m-%d')

# Determine rebalancing date (end of Q3)
# Get the date as of 3 months ago
rebalancing_date = pd.Timestamp.today() - pd.tseries.offsets.QuarterEnd()
rebalancing_date
sector_tickers = {
    'Information Technology': '^SP500-45',
    'Health Care': '^SP500-35',
    'Consumer Discretionary': '^SP500-25',
    'Financials': '^SP500-40',
    'Industrials': '^SP500-20',
    'Utilities': '^SP500-55',
    'Materials': '^SP500-15',
    'Real Estate': '^SP500-60',
    'Energy': '^GSPE',
    'Consumer Staples': '^SP500-30',
    'Communication Services': '^SP500-50'
}
# Define equal sector allocations 
sector_allocations = {sector: {sector_tickers[sector]: 1/len(sector_tickers)} for sector in sector_tickers}

# Set initial investment amount
initial_investment = 170000  # $170,000

# Download historical data for S&P 500 sectors
symbols = list(set([symbol for sector in sector_allocations for symbol in sector_allocations[sector]]))
data = yf.download(symbols, start=start_date, end=end_date)['Adj Close']
data
# Determine rebalancing date as the end of the previous quarter
rebalancing_date = pd.Timestamp.today() - pd.tseries.offsets.QuarterEnd()

# If the rebalancing date is greater than the last date of the data, go back another quarter
if rebalancing_date > data.index[-1]:
    rebalancing_date = rebalancing_date - pd.tseries.offsets.QuarterEnd()

# Extract the date in 'YYYY-MM-DD' format
rebalancing_date = rebalancing_date.strftime('%Y-%m-%d')
# Handle missing values (filling with the previous day's value)
# Normalize prices by dividing each price with the first price (measures % change relative to first day in timeline)
normalized_prices = data.ffill().bfill() / data.iloc[0, :]
normalized_prices = normalized_prices.reset_index()

# Get the data before the rebalancing date (Date column is index, but 1 level below the columns level)
pre_rebalancing_data = normalized_prices.loc[normalized_prices['Date'] <= rebalancing_date]
post_rebalancing_data = normalized_prices.loc[normalized_prices['Date'] > rebalancing_date]

post_rebalancing_data
# Calculate sector values based on allocations
sector_values = {}
for sector, allocations in sector_allocations.items():
    sector_symbol = sector_allocations[sector].keys()
    # Get first symbol in sector_symbol
    sector_symbol = next(iter(sector_symbol))
    sector_prices = pre_rebalancing_data[sector_symbol]
    sector_value = sector_prices * allocations[sector_symbol] * initial_investment
    sector_values[sector] = sector_value

sector_values
# # Calculate total portfolio value
portfolio_value = pd.DataFrame(sector_values).sum(axis=1)

print(portfolio_value)
# Get last portfolio value
reinvestment_amt = portfolio_value.iloc[-1]

rebalanced_allocations = {
    'Information Technology': {'^SP500-45': -0.19654125596063823},
    'Health Care': {'^SP500-35': -0.4308856844155548},
    'Consumer Discretionary': {'^SP500-25': 1.2358694109641364},
    'Financials': {'^SP500-40': -0.23857238903389838},
    'Industrials': {'^SP500-20': -0.5479352399900398},
    'Utilities': {'^SP500-55': -0.41745935588365185},
    'Materials': {'^SP500-15': -0.4091765199674472},
    'Real Estate': {'^SP500-60': 0.53555861485213},
    'Energy': {'^GSPE': 0.013271503035976465},
    'Consumer Staples': {'^SP500-30': 1.2682625613337892},
    'Communication Services': {'^SP500-50': 0.18760835506519805}
}

# Calculate new allocations
for sector, allocations in rebalanced_allocations.items():
    for symbol, allocation in allocations.items():
        sector_allocations[sector][symbol] = ((sector_allocations[sector][symbol] * 100) + allocation) / 100

sector_allocations
new_sector_values = {}
for sector, allocations in sector_allocations.items():
    sector_symbol = sector_allocations[sector].keys()
    # Get first symbol in sector_symbol
    sector_symbol = next(iter(sector_symbol))
    sector_prices = post_rebalancing_data[sector_symbol]
    sector_value = sector_prices * allocations[sector_symbol] * reinvestment_amt
    new_sector_values[sector] = sector_value

new_sector_values
# Calculate new portfolio value
new_portfolio_values = pd.DataFrame(new_sector_values).sum(axis=1)
new_portfolio_value = new_portfolio_values.iloc[-1]
new_portfolio_value
combined_portfolio_values = pd.concat([portfolio_value, new_portfolio_values])
combined_portfolio_values
years = len(combined_portfolio_values) / 252

# Calculate returns
annualized_return = ((combined_portfolio_values.iloc[-1] / combined_portfolio_values.iloc[0]) ** (1/years) - 1) * 100

# Calculate annualized volatility
trading_days_per_year = 252
risk = combined_portfolio_values.pct_change().std() * (trading_days_per_year ** 0.5) * 100

# Calculate Sharpe ratio (assuming a 3.954% risk-free rate, adjust as needed)
risk_free_rate = 0.03954
excess_return = annualized_return - risk_free_rate
sharpe_ratio = excess_return / risk

# # Calculate sector percentages
# sector_values = pd.concat([sector_values, new_sector_values])
# sector_percentages = pd.DataFrame(sector_values).div(combined_portfolio_values, axis=0) * 100

print(f"Initial Investment: ${initial_investment:.2f}")
print(f"Final Portfolio Value: ${combined_portfolio_values.iloc[-1]:.2f}")
print(f"Total Returns: {annualized_return:.2f}%")
print(f"Annualized Volatility: {risk:.2f}%")
print(f"Sharpe Ratio: {sharpe_ratio:.2f}")

# # Display sector percentages
# print("\nSector-wise Portfolio Allocations:")
# print(sector_percentages.round(2))