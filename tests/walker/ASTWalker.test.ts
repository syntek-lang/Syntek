import 'mocha';
import { expect } from 'chai';

import { parse } from '../test-utils';

import { ASTWalker } from '../../src/walker/ASTWalker';

import * as grammar from '../../src/grammar';
import { Node } from '../../src/grammar/Node';

describe('ASTWalker', () => {
  const program = parse('10 + 2 * 5');

  it('calls the callbacks on enter', () => {
    const array: Node[] = [];
    let parentCount = 0;

    function walkerCallback(node: Node, parents: Node[]): void {
      array.push(node);

      expect(parents.length).to.equal(parentCount);
      parentCount += 1;
    }

    new ASTWalker(program)
      .onEnter(grammar.Program, walkerCallback)
      .onEnter(grammar.ExpressionStatement, walkerCallback)
      .onEnter(grammar.BinaryExpression, walkerCallback)
      .walk();

    expect(parentCount).to.equal(4);
    expect(array.length).to.equal(4);
    expect(array).to.deep.equal([
      program,
      program.body[0],
      (program.body[0] as any).expression,
      (program.body[0] as any).expression.right,
    ]);
  });

  it('calls the callbacks on leave', () => {
    const array: Node[] = [];
    let parentCount = 3;

    function walkerCallback(node: Node, parents: Node[]): void {
      array.push(node);

      expect(parents.length).to.equal(parentCount);
      parentCount -= 1;
    }

    new ASTWalker(program)
      .onLeave(grammar.Program, walkerCallback)
      .onLeave(grammar.ExpressionStatement, walkerCallback)
      .onLeave(grammar.BinaryExpression, walkerCallback)
      .walk();

    expect(parentCount).to.equal(-1);
    expect(array.length).to.equal(4);
    expect(array).to.deep.equal([
      (program.body[0] as any).expression.right,
      (program.body[0] as any).expression,
      program.body[0],
      program,
    ]);
  });

  it('calls the callbacks when both enter and leave are provided', () => {
    const array: Node[] = [];
    let parentCount = 0;

    function walkerCallback(node: Node, parents: Node[], enter: boolean): void {
      array.push(node);

      if (!enter) {
        parentCount -= 1;
      }

      expect(parents.length).to.equal(parentCount);

      if (enter) {
        parentCount += 1;
      }
    }

    const onEnter = (node: Node, parents: Node[]): void => walkerCallback(node, parents, true);
    const onLeave = (node: Node, parents: Node[]): void => walkerCallback(node, parents, false);

    new ASTWalker(program)
      .onEnter(grammar.Program, onEnter)
      .onLeave(grammar.Program, onLeave)
      .onEnter(grammar.ExpressionStatement, onEnter)
      .onLeave(grammar.ExpressionStatement, onLeave)
      .onEnter(grammar.BinaryExpression, onEnter)
      .onLeave(grammar.BinaryExpression, onLeave)
      .walk();

    expect(parentCount).to.equal(0);
    expect(array.length).to.equal(8);
    expect(array).to.deep.equal([
      program,
      program.body[0],
      (program.body[0] as any).expression,
      (program.body[0] as any).expression.right,
      (program.body[0] as any).expression.right,
      (program.body[0] as any).expression,
      program.body[0],
      program,
    ]);
  });
});
