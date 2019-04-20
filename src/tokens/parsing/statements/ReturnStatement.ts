import { $ } from '../../../structures/rule';
import { Token, TokenMatcher } from '../../../structures/token';

import tokens from '../../lexing';
import Expression from '../expressions/Expression';

export class ReturnStatement extends Token {
  /**
   * The argument that is returned by the return statement
   */
  readonly argument?: Token;

  constructor(location, matchedTokens) {
    super(location, matchedTokens);

    if (matchedTokens[1] instanceof Token) {
      this.argument = matchedTokens[1];
    }
  }

  build(): string {
    return '';
  }
}

export const ReturnStatementMatcher = new TokenMatcher(ReturnStatement, $.SEQ(
  tokens.Return,
  $.OPT(Expression),
));
