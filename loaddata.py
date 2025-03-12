import pymysql
import pandas as pd

# Connect to MySQL
conn = pymysql.connect(
    host='localhost',
    user='root',
    password='---',  # Replace with your MySQL password
    database='imdb'
)
cursor = conn.cursor()

# Load title.basics.tsv
print("Loading title.basics.tsv...")
basics_df = pd.read_csv('/Users/dylanboles/Downloads/Comp_3_Files/title.basics.tsv', sep='\t', dtype={'startYear': 'object', 'endYear': 'object', 'runtimeMinutes': 'object'})

# Replace '\N' with None (NULL in SQL)
basics_df.replace('\\N', None, inplace=True)

# Insert data into movies table
for index, row in basics_df.iterrows():
    try:
        cursor.execute("""
            INSERT INTO movies (tconst, titleType, primaryTitle, originalTitle, isAdult, startYear, endYear, runtimeMinutes, genres)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (row['tconst'], row['titleType'], row['primaryTitle'], row['originalTitle'], row['isAdult'], row['startYear'], row['endYear'], row['runtimeMinutes'], row['genres']))
    except pymysql.Error as err:  # Use pymysql.Error instead of mysql.connector.Error
        print(f"Error inserting {row['tconst']}: {err}")

# Load title.ratings.tsv
print("Loading title.ratings.tsv...")
ratings_df = pd.read_csv('/Users/dylanboles/Downloads/Comp_3_Files/title.ratings.tsv', sep='\t')

# Insert data into ratings table
for index, row in ratings_df.iterrows():
    try:
        cursor.execute("""
            INSERT INTO ratings (tconst, averageRating, numVotes)
            VALUES (%s, %s, %s)
        """, (row['tconst'], row['averageRating'], row['numVotes']))
    except pymysql.Error as err:  # Use pymysql.Error instead of mysql.connector.Error
        print(f"Error inserting {row['tconst']}: {err}")

# Commit changes and close connection
conn.commit()
cursor.close()
conn.close()
print("Data loading complete!")