import * as yup from 'yup';

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

// Schémas de validation
const emailSchema = yup.string()
  .email('Format d\'email invalide')
  .required('L\'email est requis')
  .matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    'Format d\'email invalide'
  );

const passwordSchema = yup.string()
  .required('Le mot de passe est requis')
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
  );

export class InputValidation {
  static sanitizeInput(input: string): string {
    // Supprime les caractères dangereux et les scripts
    return input
      .replace(/<[^>]*>/g, '') // Supprime les balises HTML
      .replace(/[&<>"']/g, '') // Supprime les caractères spéciaux
      .trim(); // Supprime les espaces inutiles
  }

  static async validateEmail(email: string): Promise<ValidationResult> {
    try {
      const sanitizedEmail = this.sanitizeInput(email);
      await emailSchema.validate(sanitizedEmail);
      return { isValid: true };
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        return { isValid: false, error: error.message };
      }
      return { isValid: false, error: 'Erreur de validation de l\'email' };
    }
  }

  static async validatePassword(password: string): Promise<ValidationResult> {
    try {
      await passwordSchema.validate(password);
      return { isValid: true };
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        return { isValid: false, error: error.message };
      }
      return { isValid: false, error: 'Erreur de validation du mot de passe' };
    }
  }

  static validatePhoneNumber(phone: string): ValidationResult {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const isValid = phoneRegex.test(phone);
    return {
      isValid,
      error: isValid ? undefined : 'Numéro de téléphone invalide'
    };
  }

  static validateUsername(username: string): ValidationResult {
    const sanitizedUsername = this.sanitizeInput(username);
    const isValid = sanitizedUsername.length >= 3 && sanitizedUsername.length <= 30;
    return {
      isValid,
      error: isValid ? undefined : 'Le nom d\'utilisateur doit contenir entre 3 et 30 caractères'
    };
  }
}

// Exemple d'utilisation des validateurs dans un formulaire
export const validateLoginForm = async (data: { 
  email: string; 
  password: string; 
}): Promise<{ isValid: boolean; errors: LoginFormErrors }> => {
  const errors: LoginFormErrors = {};
  let isValid = true;

  // Validation de l'email
  const emailValidation = await InputValidation.validateEmail(data.email);
  if (!emailValidation.isValid && emailValidation.error) {
    errors.email = emailValidation.error;
    isValid = false;
  }

  // Validation du mot de passe
  const passwordValidation = await InputValidation.validatePassword(data.password);
  if (!passwordValidation.isValid && passwordValidation.error) {
    errors.password = passwordValidation.error;
    isValid = false;
  }

  return { isValid, errors };
};

// Exemple d'utilisation dans un formulaire
const handleLogin = async (formData: { email: string; password: string }) => {
  // Validation du formulaire
  const { isValid, errors } = await validateLoginForm(formData);
  
  if (!isValid) {
    // Gérer les erreurs
    console.log(errors);
    return;
  }

  // Si la validation est réussie, procéder à la connexion
  // ...
};
