---
inject: true
to: src/Discord/Command/Commands.ts
before: \] // END_OF_COMMANDS
---
    {
        data: {
            name: '<%=h.changeCase.param(name)%>',
            description: "FILL IN DESCRIPTION",
            options: [],
            needsAPIKey: false
        },
        controller: new <%=Name%>Controller(),
    }, -%>
