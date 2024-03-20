/**
 * Test Shortener rapidly
 */

const testUrl='https://www.google.com/'

describe('Test Shortener homepage', () => {
  beforeEach(() => cy.visit('/'));

  it('Check if page is loaded', () => {
    cy.get('h1').contains(/Short/);
  });

  it('Shorten a link', () => {
    cy.typeSearch(testUrl)
    // Get the new value of the input
    cy.get('[data-cy="search"]').should('be.visible').and((input) => {
      const val = input.val()
      expect(val).to.match(/localhost/)
      expect(val !== testUrl)
    // Check if the value redirect to google 
    }).then(input => {
      const val = input.val()
      cy.visit(val as string)
      cy.url().should('eq', testUrl)
    });
  })

  it('Shorten a fake link', () => {
    cy.typeSearch('azdazdad')
    cy.get('[data-cy="error"]').should('have.text',"This is not a valid URL")
  })

  it('Retry a link', () => {
    cy.typeSearch(testUrl)
    cy.get('[data-cy="retry"]').click()
    cy.get('[data-cy="search"]').should('have.value', '')
  })
});
