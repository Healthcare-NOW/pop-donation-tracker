# API Backend

The API backend is a Flask app backed by a Postgres database. To run it locally you'll need Python (3.7+) 
and a Postgres installation.

## Local development and testing

For what follows, we operate entirely in the `backend` directory.

1.  (Optional) It's advisable to work within a virtual environment. Create and activate one using the steps described 
    [here](https://docs.python.org/3/tutorial/venv.html).

1.  Install production and development dependencies:

    ```shell
    pip install -r requirements.txt
    pip install -r requirements_dev.txt
    ```

1.  Copy the contents of `.env.shadow.dev` to a file called `.env` in the same folder. This file contains some default 
    settings for environment variables.

1.  Set up development and test databases. Create a database called `poptracker` and another one called `poptracker_test`.
    If you're running a local Postgres server and the username is your Unix username with a blank password, you don't
    have to do anything else. Otherwise add an entry to `.env` of the form:
    
    ```
    POPTRACKER_DB_URI=<connection-string>
    ```
    where `<connection-string>` should be in the format described 
    [here](https://flask-sqlalchemy.palletsprojects.com/en/2.x/config/#connection-uri-format). The dialect is `postgresql`,
    and the driver is `psycopg2`.
    
1.  Run `flask db upgrade`. If all goes well a number of tables should be created in the `poptracker` database.

1.  Run the tests: `python -m pytest`.

1.  Run the development server: `flask run`. It should be receiving requests at `localhost:3000`.

 
