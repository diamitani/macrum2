export interface ValidationError {
  field: string
  message: string
}

export function validateBusiness(data: Record<string, any>): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.name || data.name.trim() === "") {
    errors.push({ field: "name", message: "Business name is required" })
  } else if (data.name.length > 100) {
    errors.push({ field: "name", message: "Business name must be less than 100 characters" })
  }

  if (data.description && data.description.length > 500) {
    errors.push({ field: "description", message: "Description must be less than 500 characters" })
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: "email", message: "Please enter a valid email address" })
  }

  if (
    data.website &&
    !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(
      data.website,
    )
  ) {
    errors.push({ field: "website", message: "Please enter a valid website URL" })
  }

  if (data.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(data.phone)) {
    errors.push({ field: "phone", message: "Please enter a valid phone number" })
  }

  return errors
}
