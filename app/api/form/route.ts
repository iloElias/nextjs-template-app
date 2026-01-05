export const asyncData = {};

export async function GET() {
  return Response.json(asyncData, { status: 200 });
}
