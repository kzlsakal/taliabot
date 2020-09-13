import neo4j from 'neo4j-driver';

const neo4jUrl = process.env.NEO4J_URL || 'bolt://localhost:7687';
const neo4jUser = process.env.NEO4J_USER || 'neo4j';
const neo4jPassword = process.env.NEO4J_PASSWORD || 'nopassword';
export const driver = neo4j.driver(
  neo4jUrl,
  neo4j.auth.basic(neo4jUser, neo4jPassword)
);

export const neo4jInt = neo4j.int;
export const extract = result => result.records.map(record => record.get(0));
