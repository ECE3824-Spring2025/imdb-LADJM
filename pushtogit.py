import subprocess
import getpass

# Define the parameters
user = "root"  # Your MySQL username
database = "imdb"  # The database you want to dump
tables = ["movies", "ratings"]  # List of tables you want to dump
output_file = "multiple_tables_dump.sql"  # Output file name

# Prompt the user for the MySQL password securely
password = getpass.getpass(prompt="Enter MySQL password: ")

# Build the mysqldump command
tables_string = " ".join(tables)
command = f"mysqldump -u {user} -p{password} {database} {tables_string} > {output_file}"

# Run the command
try:
    subprocess.run(command, shell=True, check=True)
    print(f"Backup of {', '.join(tables)} completed successfully and saved to {output_file}.")
except subprocess.CalledProcessError as e:
    print(f"An error occurred while executing mysqldump: {e}")