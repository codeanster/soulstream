"""
setup.py
--------
Installation script for the Soulstream project.
Making the digital memory system installable.
"""

from setuptools import setup, find_packages

setup(
    name="soulstream",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "flask",
        "flask-cors",
        "sqlalchemy",
        "pinecone-client",
        "openai",
        "python-dotenv",
    ],
    python_requires=">=3.8",
)
