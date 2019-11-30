from sodapy import Socrata
import pandas as pd

client = Socrata("opendata.camden.gov.uk", "n37V03afjhyUMMsHIz1xHEnvL")

results = client.get("7hiv-3r9k", limit=2000)
results_df = pd.DataFrame.from_records(results)

disabled_df = results_df[results_df.restriction_type.str.contains("disabled")]

print(disabled_df)

disabled_df.to_csv('data/data.csv', index=False)

# for col in results_df.columns:
#     print(col)

# restriction_type = results_df['restriction_type']


#     firstWord = row.split(' ', 1)[0]
#     if firstWord != 'disabled':
#         results_df.drop()
# firstWord, rest = str(restriction_type).split(maxsplit=1)
