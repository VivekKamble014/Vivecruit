export async function GET() {
  try {
    return Response.json(
      { 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'vivecruit'
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { 
        status: 'unhealthy', 
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

