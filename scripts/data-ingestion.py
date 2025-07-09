#!/usr/bin/env python3
"""
Data Ingestion Script for Threat Intelligence Dashboard
This script processes the Kaggle CSV dataset and populates the database
"""

import pandas as pd
import mysql.connector
import os
import sys
from typing import Dict, List
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ThreatDataIngestion:
    def __init__(self, csv_file_path: str, db_config: Dict[str, str]):
        self.csv_file_path = csv_file_path
        self.db_config = db_config
        self.connection = None
        
    def connect_to_database(self):
        """Establish database connection"""
        try:
            self.connection = mysql.connector.connect(**self.db_config)
            logger.info("Successfully connected to database")
        except mysql.connector.Error as err:
            logger.error(f"Database connection failed: {err}")
            sys.exit(1)
    
    def load_csv_data(self) -> pd.DataFrame:
        """Load and validate CSV data"""
        try:
            df = pd.read_csv(self.csv_file_path)
            logger.info(f"Loaded {len(df)} records from CSV file")
            
            # Validate required columns
            required_columns = [
                'Original Threat Description',
                'Cleaned Threat Description', 
                'Threat Category',
                'Severity Score'
            ]
            
            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                logger.error(f"Missing required columns: {missing_columns}")
                sys.exit(1)
                
            return df
            
        except FileNotFoundError:
            logger.error(f"CSV file not found: {self.csv_file_path}")
            sys.exit(1)
        except Exception as e:
            logger.error(f"Error loading CSV data: {e}")
            sys.exit(1)
    
    def clean_and_transform_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean and transform the data for database insertion"""
        # Remove duplicates
        df = df.drop_duplicates()
        
        # Handle missing values
        df = df.dropna(subset=['Original Threat Description', 'Cleaned Threat Description'])
        
        # Standardize threat categories
        category_mapping = {
            'phishing': 'Phishing',
            'malware': 'Malware',
            'ransomware': 'Ransomware',
            'ddos': 'DDoS',
            'data breach': 'Data Breach',
            'social engineering': 'Social Engineering',
            'insider threat': 'Insider Threat',
            'apt': 'Advanced Persistent Threat'
        }
        
        df['Threat Category'] = df['Threat Category'].str.lower().map(
            lambda x: category_mapping.get(x, x.title())
        )
        
        # Standardize severity scores
        severity_mapping = {
            'low': 'Low',
            'medium': 'Medium', 
            'high': 'High'
        }
        
        df['Severity Score'] = df['Severity Score'].str.lower().map(
            lambda x: severity_mapping.get(x, x.title())
        )
        
        # Generate unique IDs
        df['id'] = range(1, len(df) + 1)
        df['id'] = df['id'].astype(str)
        
        logger.info(f"Cleaned data: {len(df)} records ready for insertion")
        return df
    
    def insert_data_to_database(self, df: pd.DataFrame):
        """Insert cleaned data into database"""
        cursor = self.connection.cursor()
        
        # Clear existing data (optional - remove in production)
        cursor.execute("DELETE FROM threats")
        logger.info("Cleared existing threat data")
        
        # Prepare insert statement
        insert_query = """
        INSERT INTO threats (
            id, 
            original_threat_description, 
            cleaned_threat_description, 
            threat_category, 
            severity_score
        ) VALUES (%s, %s, %s, %s, %s)
        """
        
        # Insert data in batches
        batch_size = 1000
        total_inserted = 0
        
        for i in range(0, len(df), batch_size):
            batch = df.iloc[i:i + batch_size]
            
            data_to_insert = [
                (
                    row['id'],
                    row['Original Threat Description'],
                    row['Cleaned Threat Description'],
                    row['Threat Category'],
                    row['Severity Score']
                )
                for _, row in batch.iterrows()
            ]
            
            try:
                cursor.executemany(insert_query, data_to_insert)
                self.connection.commit()
                total_inserted += len(data_to_insert)
                logger.info(f"Inserted batch: {total_inserted}/{len(df)} records")
                
            except mysql.connector.Error as err:
                logger.error(f"Error inserting batch: {err}")
                self.connection.rollback()
                
        cursor.close()
        logger.info(f"Successfully inserted {total_inserted} threat records")
    
    def generate_statistics(self):
        """Generate and display dataset statistics"""
        cursor = self.connection.cursor()
        
        # Total threats
        cursor.execute("SELECT COUNT(*) FROM threats")
        total_threats = cursor.fetchone()[0]
        
        # Category distribution
        cursor.execute("""
            SELECT threat_category, COUNT(*) as count 
            FROM threats 
            GROUP BY threat_category 
            ORDER BY count DESC
        """)
        category_stats = cursor.fetchall()
        
        # Severity distribution
        cursor.execute("""
            SELECT severity_score, COUNT(*) as count 
            FROM threats 
            GROUP BY severity_score 
            ORDER BY count DESC
        """)
        severity_stats = cursor.fetchall()
        
        cursor.close()
        
        # Display statistics
        print("\n" + "="*50)
        print("THREAT INTELLIGENCE DATASET STATISTICS")
        print("="*50)
        print(f"Total Threats: {total_threats:,}")
        
        print(f"\nThreat Categories:")
        for category, count in category_stats:
            percentage = (count / total_threats) * 100
            print(f"  {category}: {count:,} ({percentage:.1f}%)")
        
        print(f"\nSeverity Distribution:")
        for severity, count in severity_stats:
            percentage = (count / total_threats) * 100
            print(f"  {severity}: {count:,} ({percentage:.1f}%)")
        
        print("="*50)
    
    def run_ingestion(self):
        """Main method to run the complete ingestion process"""
        logger.info("Starting threat data ingestion process")
        
        # Connect to database
        self.connect_to_database()
        
        # Load and process data
        df = self.load_csv_data()
        df_cleaned = self.clean_and_transform_data(df)
        
        # Insert data
        self.insert_data_to_database(df_cleaned)
        
        # Generate statistics
        self.generate_statistics()
        
        # Close connection
        if self.connection:
            self.connection.close()
            logger.info("Database connection closed")
        
        logger.info("Data ingestion process completed successfully")

def main():
    """Main function to run the ingestion script"""
    # Database configuration
    db_config = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'user': os.getenv('DB_USER', 'root'),
        'password': os.getenv('DB_PASSWORD', ''),
        'database': os.getenv('DB_NAME', 'threat_intelligence'),
        'charset': 'utf8mb4'
    }
    
    # CSV file path (update this to point to your downloaded Kaggle dataset)
    csv_file_path = os.getenv('CSV_FILE_PATH', './nlp_based_cyber_security_dataset.csv')
    
    if not os.path.exists(csv_file_path):
        logger.error(f"CSV file not found: {csv_file_path}")
        logger.info("Please download the dataset from: https://www.kaggle.com/datasets/hussainsheikh03/nlp-based-cyber-security-dataset")
        sys.exit(1)
    
    # Run ingestion
    ingestion = ThreatDataIngestion(csv_file_path, db_config)
    ingestion.run_ingestion()

if __name__ == "__main__":
    main()
