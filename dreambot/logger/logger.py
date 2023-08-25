import logging
import os

#######################################
# Set up logging
#######################################

# Define the path to the log file
LOG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dreambot.log')

class DreamLogger(logging.Logger):
    def logDiscordError(self, e: Exception):
        self.error(f"Discord error: {e}")

    def logStabilityError(self, e: Exception):
        self.error(f"Stability API Error: {e}")

    def logDatabaseError(self, e: Exception):
        self.error(f"Database error: {e}")

    def logErrorRemaining(self, e: Exception):
        self.error(f"Caught an error: {e}")

logging.setLoggerClass(DreamLogger)

# create logger object
logger = logging.getLogger('dreambot')

#set overall level (debug is lowest of handlers, will process all messages)
logger.setLevel(logging.DEBUG)

# create file handler and set level to debug and above
file_handler = logging.FileHandler(filename=LOG_PATH, encoding='utf-8', mode='w')
file_handler.setLevel(logging.DEBUG)

# create console handler and set level to error and above
console_handler = logging.StreamHandler()
# switch DEBUG with ERROR for less fluff in log file
console_handler.setLevel(logging.DEBUG)

# create formatters and handlers
file_format = logging.Formatter('%(asctime)s:%(levelname)s:%(name)s: %(message)s')
console_format = logging.Formatter('%(asctime)s:%(levelname)s:%(name)s')
file_handler.setFormatter(file_format)
console_handler.setFormatter(console_format)

#add handlers to logger
logger.addHandler(file_handler)
logger.addHandler(console_handler)

# Set SQLAlchemy logging level to ERROR only
logging.getLogger('sqlalchemy.engine').setLevel(logging.DEBUG)