---
inject: true
to: src/Discord/View/enum/EMBED_ID.ts
before: \}
skip_if: <%=h.changeCase.constant(name)%>
---
    <%=h.changeCase.constant(name)%> = "<%=h.changeCase.param(name)%>",-%>
