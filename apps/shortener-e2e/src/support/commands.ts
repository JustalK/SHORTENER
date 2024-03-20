/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    typeSearch(value: string): void;
  }
}

// -- This is a parent command --
Cypress.Commands.add('typeSearch', (value: string) => {
  cy.intercept(
    'POST',
    Cypress.env('API_SHORTENER'),
  ).as('shorten')
  cy.get('[data-cy="search"]').type(value)
  cy.get('[data-cy="shorten"]').click()
  cy.wait('@shorten')
});
