import { $ } from '../../../structures/rule';
import { Token, TokenMatcher } from '../../../structures/token';

import tokens from '../../lexing';
import Expression from './Expression';

export class ComparisonExpression extends Token {
  /**
   * The left hand side of the comparison
   */
  readonly left: Token;

  /**
   * The operator of the comparison
   */
  readonly operator: Token;

  /**
   * The right hand side of the comparison
   */
  readonly right: Token;

  constructor(location, matchedTokens) {
    super(location, matchedTokens);

    this.left = matchedTokens[0];
    this.operator = matchedTokens[1];
    this.right = matchedTokens[2];
  }

  build(): string {
    let op: string;

    switch (this.operator.constructor) {
      case tokens.Is: op = '$eq'; break;
      case tokens.IsNot: op = '$neq'; break;
      case tokens.IsLessThan: op = '$lt'; break;
      case tokens.IsGreaterThan: op = '$gt'; break;
      default: throw new Error('Unknown comparison token');
    }

    const left = this.left instanceof tokens.Identifier ? `this.get('${this.left.build()}')` : this.left.build();
    const right = this.right instanceof tokens.Identifier ? `this.get('${this.right.build()}')` : this.right.build();

    return `${left}.callMethod('${op}', [${right}])`;
  }
}

export const ComparisonExpressionMatcher = new TokenMatcher(ComparisonExpression, $.SEQ(
  Expression,
  $.OR(
    tokens.Is,
    tokens.IsNot,
    tokens.IsLessThan,
    tokens.IsGreaterThan,
  ),
  Expression,
));
