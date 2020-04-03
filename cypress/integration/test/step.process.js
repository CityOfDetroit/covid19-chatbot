/// <reference types="cypress" />

context('Steps', () => {
    it('Start Application', () => {
        cy.visit('/')
    
        cy.contains('Welcome to City of Detroit Property Application Intake.')

        cy.contains('START').click()

        cy.contains('Are you a resident of Detroit?')
    })

    it('Move to second step', () => {

        cy.contains('Yes').click()

        cy.contains('Helpful hints and tips')
        cy.contains('Need definition of affiliated company.')
        cy.contains('Do you or any affiliated company currently own property in Detroit?')
    })
})