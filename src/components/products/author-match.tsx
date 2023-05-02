// isAuthorMatch is a function that checks if the given author name matches the given first name and last name.
// The function removes diacritics from the author name and first/last name and formats them in different ways to compare.
// The function returns a boolean value indicating if the author name matches any of the formatted names.

import removeDiacritics from "../../utils/front-end/remove-diacritics";

const isAuthorMatch = (author: string, firstName: string, lastName: string) => {
  // Normalize the author name by removing diacritics and non-alphabetic characters
  const normalizedAuthor = removeDiacritics(
    author.replace(/[^a-zA-Z\s\-]+/g, "").trim()
  );
  // Split the author name into first name and last name
  const authorParts = normalizedAuthor.split(" ").map((part) => part.trim());

  // Normalize the first name and last name by removing diacritics
  firstName = removeDiacritics(firstName);
  lastName = removeDiacritics(lastName);

  // Check if the author name consists of two parts (first name and last name)
  if (authorParts.length === 2) {
    const [aFirstName, aLastName] = authorParts;

    // Format the first name and last name in different ways
    const formattedNames = [
      `${firstName} ${lastName}`,
      `${lastName} ${firstName}`,
      `${firstName.charAt(0)}. ${lastName}`,
      `${firstName.charAt(0)} ${lastName}`,
      `${lastName}, ${firstName.charAt(0)}.`,
      `${lastName}, ${firstName}`,
      `Dr. ${firstName} ${lastName}`,
    ];

    // Return true if the normalized author name matches any of the formatted names
    return (
      formattedNames.includes(normalizedAuthor) ||
      formattedNames.includes(`${aLastName} ${aFirstName}`)
    );
  }
  // Check if the author name consists of one part (last name)
  else if (authorParts.length === 1) {
    const [aLastName] = authorParts;
    // Format the last name in different ways
    const formattedNames = [
      `${lastName}`,
      `${lastName}, ${firstName.charAt(0)}.`,
      `${lastName}, ${firstName}`,
    ];

    // Return true if the normalized author name matches any of the formatted names
    return formattedNames.includes(normalizedAuthor);
  }

  // Return false if the author name does not match any of the formatted names
  return false;
};

export default isAuthorMatch;
