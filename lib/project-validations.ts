export interface ProjectValidationError {
  field: string
  message: string
}

export function validateProject(data: Record<string, any>): ProjectValidationError[] {
  const errors: ProjectValidationError[] = []

  if (!data.name || data.name.trim() === "") {
    errors.push({ field: "name", message: "Project name is required" })
  } else if (data.name.length > 100) {
    errors.push({ field: "name", message: "Project name must be less than 100 characters" })
  }

  if (!data.description || data.description.trim() === "") {
    errors.push({ field: "description", message: "Project description is required" })
  } else if (data.description.length > 500) {
    errors.push({ field: "description", message: "Description must be less than 500 characters" })
  }

  if (!data.businessId || data.businessId.trim() === "") {
    errors.push({ field: "businessId", message: "Please select a business" })
  }

  if (!data.status || data.status.trim() === "") {
    errors.push({ field: "status", message: "Please select a status" })
  }

  if (!data.priority || data.priority.trim() === "") {
    errors.push({ field: "priority", message: "Please select a priority" })
  }

  if (!data.startDate) {
    errors.push({ field: "startDate", message: "Start date is required" })
  }

  if (!data.dueDate) {
    errors.push({ field: "dueDate", message: "Due date is required" })
  }

  if (data.startDate && data.dueDate) {
    const startDate = new Date(data.startDate)
    const dueDate = new Date(data.dueDate)

    if (dueDate <= startDate) {
      errors.push({ field: "dueDate", message: "Due date must be after start date" })
    }
  }

  return errors
}
