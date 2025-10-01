import database from "infra/database.js"

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const connectionsQuery = `SELECT count(*) FROM pg_stat_activity WHERE datname = '${process.env.POSTGRES_DB}';`
  
  const pgVersionQueryResult = await database.query("SELECT version();")
  const pgVersion = pgVersionQueryResult.rows[0].version


  const connectionsQueryResult = await database.query({
    text: "SELECT count(*) FROM pg_stat_activity WHERE datname = $1",
    values: [process.env.POSTGRES_DB]
    }
  )
  const openConnections = connectionsQueryResult.rowCount

  const maxConnectionsQueryResult = await database.query("SELECT current_setting('max_connections');")
  const maxConnections = parseInt(maxConnectionsQueryResult.rows[0].current_setting)

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      version: pgVersion,
      open_connections: openConnections,
      max_connections: maxConnections
    }
  })
}

export default status;
