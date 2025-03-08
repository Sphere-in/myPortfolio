import { NextResponse } from "next/server"
import { getProjects } from "@/firebase";

export async function GET() {
  try {
    const projects = await getProjects()
    const displayedProjects = projects.filter((project) => project.display === true)
    return NextResponse.json({ data: displayedProjects })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}



// import { getProjects } from "@/firebase";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     const projects = await getProjects();

//     return NextResponse.json({ success: true, data: projects }, { status: 200 });
//   } catch (error) {
//     console.error("There is a problem in the server:", error);

//     return NextResponse.json(
//       { success: false, error: "There is a problem in the server" },
//       { status: 500 }
//     );
//   }
// }
