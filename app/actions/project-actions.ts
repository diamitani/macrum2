"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// In a real app, this would interact with your database
// For now, we'll simulate deletion with a delay
export async function deleteProject(projectId: string) {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In a real app, you would delete the project from your database
    // Example with a database:
    // await db.project.delete({ where: { id: projectId } })

    // Revalidate the projects page to reflect the changes
    revalidatePath("/projects")
    revalidatePath("/businesses")

    return { success: true, message: "Project deleted successfully" }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { success: false, message: "Failed to delete project" }
  }
}

// Function to delete a project and redirect
export async function deleteProjectAndRedirect(projectId: string, redirectTo = "/projects") {
  const result = await deleteProject(projectId)

  if (result.success) {
    redirect(redirectTo)
  }

  return result
}
