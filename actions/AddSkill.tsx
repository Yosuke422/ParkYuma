"use server";
 
import { getSession } from "@/utils/sessions";
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
 
export async function addSkill(skill_name: string, skill_level: string) {
  let db = null;
 
  // Check if the database instance has been initialized
  if (!db) {
    // If the database instance is not initialized, open the database connection
    db = await open({
      filename: process.env.DATABASE_NAME || "", // Specify the database file path
      driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
    });
  }
 
  // Get the logged user
  const session = await getSession();
  // Check if the user already have this skill
  const verifSql = "SELECT rowid FROM skills WHERE skill_name = ? AND user = ?";
  const verif = await db.get(verifSql, skill_name, session.rowid);
 
  if (verif) {
    return NextResponse.json(
      { message: "You already have this skill" },
      { status: 403 }
    );
  }
 
  // Insert new skill
  const sql = `INSERT INTO skills(skill_name, level, user) VALUES(?, ?, ?)`;
  const skillAdd = await db.run(sql, skill_name, skill_level, session.rowid);
 
  return NextResponse.json(skillAdd);
}