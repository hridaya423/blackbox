import { evaluate, parse, simplify } from 'mathjs';

export function validateLinearExpression(
  userExpression: string,
  expectedA: number,
  expectedB: number
): boolean {
  try {
    let normalizedExpression = userExpression
      .replace(/\s+/g, '')
      .toLowerCase()
      .replace(/(\d)([a-z])/g, '$1*$2')
      .replace(/([a-z])(\d)/g, '$1*$2');

    const parsedExpression = parse(normalizedExpression);
    const simplifiedExpression = simplify(parsedExpression);

    const testValues = [0, 1, 2, -1, 10];
    
    for (const x of testValues) {
      try {
        const userResult = evaluate(simplifiedExpression.toString(), { x });
        const expectedResult = expectedA * x + expectedB;
  
        if (Math.abs(userResult - expectedResult) > 1e-10) {
          return false;
        }
      } catch (error) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

export function extractLinearCoefficients(expression: string): { a: number; b: number } | null {
  try {
    const normalizedExpression = expression
      .replace(/\s+/g, '')
      .toLowerCase()
      .replace(/(\d)([a-z])/g, '$1*$2')
      .replace(/([a-z])(\d)/g, '$1*$2');

    const x1 = 0, x2 = 1;
    const y1 = evaluate(normalizedExpression, { x: x1 });
    const y2 = evaluate(normalizedExpression, { x: x2 });

    const a = y2 - y1;
    const b = y1;

    return { a, b };
  } catch (error) {
    return null;
  }
}

export function getExpressionHint(expression: string): string {
  const cleaned = expression.replace(/\s+/g, '').toLowerCase();
  
  if (!cleaned.includes('x')) {
    return 'Expression must include variable "x"';
  }
  
  if (cleaned.includes('^') || cleaned.includes('**')) {
    return 'Only linear expressions (no exponents) are allowed';
  }
  
  if (cleaned.includes('/') || cleaned.includes('sqrt') || cleaned.includes('log')) {
    return 'Only linear expressions (no division, square roots, or logarithms) are allowed';
  }
  
  return '';
}