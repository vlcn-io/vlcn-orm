/*@jsxRuntime automatic @jsxImportSource https://esm.sh/react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "https://esm.sh/react/jsx-runtime";
import Mermaid from "/dist/components/Mermaid.js";
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? _jsx(MDXLayout, Object.assign({}, props, {
    children: _jsx(_createMdxContent, {})
  })) : _createMdxContent();
  function _createMdxContent() {
    const _components = Object.assign({
      nav: "nav",
      ol: "ol",
      li: "li",
      a: "a",
      h1: "h1",
      span: "span",
      p: "p",
      pre: "pre",
      code: "code",
      h2: "h2"
    }, props.components);
    return _jsxs(_Fragment, {
      children: [_jsx(_components.nav, {
        className: "toc",
        children: _jsxs(_components.ol, {
          className: "toc-level toc-level-1",
          children: [_jsx(_components.li, {
            className: "toc-item toc-item-h1",
            children: _jsx(_components.a, {
              className: "toc-link toc-link-h1",
              href: "#review",
              children: "Review"
            })
          }), _jsxs(_components.li, {
            className: "toc-item toc-item-h1",
            children: [_jsx(_components.a, {
              className: "toc-link toc-link-h1",
              href: "#planning",
              children: "Planning"
            }), _jsxs(_components.ol, {
              className: "toc-level toc-level-2",
              children: [_jsx(_components.li, {
                className: "toc-item toc-item-h2",
                children: _jsx(_components.a, {
                  className: "toc-link toc-link-h2",
                  href: "#the-walk",
                  children: "The Walk"
                })
              }), _jsx(_components.li, {
                className: "toc-item toc-item-h2",
                children: _jsx(_components.a, {
                  className: "toc-link toc-link-h2",
                  href: "#a-more-complicated-walk",
                  children: "A More Complicated Walk"
                })
              }), _jsx(_components.li, {
                className: "toc-item toc-item-h2",
                children: _jsx(_components.a, {
                  className: "toc-link toc-link-h2",
                  href: "#hops-and-many-plans",
                  children: "Hops and Many Plans"
                })
              })]
            })]
          }), _jsx(_components.li, {
            className: "toc-item toc-item-h1",
            children: _jsx(_components.a, {
              className: "toc-link toc-link-h1",
              href: "#optimization",
              children: "Optimization"
            })
          })]
        })
      }), "\n", _jsxs(_components.h1, {
        id: "review",
        children: [_jsx(_components.a, {
          "aria-hidden": "true",
          tabIndex: "-1",
          href: "#review",
          children: _jsx(_components.span, {
            className: "icon icon-link"
          })
        }), "Review"]
      }), "\n", _jsxs(_components.p, {
        children: ["Previously we discussed the ", _jsx(_components.a, {
          href: "./2022-05-26-query-builder",
          children: "query builder"
        }), "."]
      }), "\n", _jsx(_components.p, {
        children: "To recap, when a user interacts with the query builder a linked list of queries is built up behind the scenes. This list of queries holds a reference to the prior query and an expression to apply. Wehn taking this list together as a whole, it represents the user's desired final query."
      }), "\n", _jsx(_components.p, {
        children: "E.g., invoking the query builder like this"
      }), "\n", _jsx(_components.pre, {
        children: _jsxs(_components.code, {
          className: "hljs language-typescript",
          children: [_jsx(_components.span, {
            className: "hljs-keyword",
            children: "const"
          }), " jeffQuery = user\n  .", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "queryPhotos"
          }), "()\n  .", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "whereUploadDate"
          }), "(P.", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "greaterThan"
          }), "(", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "new"
          }), " ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "Date"
          }), "(", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"2022-01-01\""
          }), ")))\n  .", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "queryTaggedUsers"
          }), "()\n  .", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "whereName"
          }), "(P.", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "equals"
          }), "(", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"Jeff\""
          }), "));\n"]
        })
      }), "\n", _jsx(_components.p, {
        children: "returns a linked list that looks roughly like"
      }), "\n", _jsx("center", {
        children: _jsx(Mermaid, {
          id: "hhg",
          chart: `graph LR
UserQueryF["UserQuery(name == Jeff)"] --> UserQuery
UserQuery --> PhotoQueryF["PhotoQuery(uploadDate > 2022-01-01)"]
PhotoQueryF --> PhotoQuery`
        })
      }), "\n", _jsxs(_components.p, {
        children: ["The first node in the list represents the last query builder method that was invoked (", _jsx(_components.code, {
          children: "whereName(P.equals('Jeff'))"
        }), ") and the last node in the list the first query builder method (", _jsx(_components.code, {
          children: "queryPhotos"
        }), ")."]
      }), "\n", _jsxs(_components.h1, {
        id: "planning",
        children: [_jsx(_components.a, {
          "aria-hidden": "true",
          tabIndex: "-1",
          href: "#planning",
          children: _jsx(_components.span, {
            className: "icon icon-link"
          })
        }), "Planning"]
      }), "\n", _jsx(_components.p, {
        children: "There are several important steps that happen after building a query to get it into a state where it can be executed. The first of those is the query planning step."
      }), "\n", _jsx(_components.p, {
        children: "The core idea of query planning is to walk the list of queries returned by the query builder, gather them into groups and convert them into expressions that can be executed."
      }), "\n", _jsxs(_components.h2, {
        id: "the-walk",
        children: [_jsx(_components.a, {
          "aria-hidden": "true",
          tabIndex: "-1",
          href: "#the-walk",
          children: _jsx(_components.span, {
            className: "icon icon-link"
          })
        }), "The Walk"]
      }), "\n", _jsx(_components.p, {
        children: "We walk the list of queries provided by our query builder, collecting the expressions it contains into one or more plans."
      }), "\n", _jsx(_components.p, {
        children: "We perform this walk by asking the last query returned by the query builder to plan itself. This query then asks the query before it to plan itself and so on, all the way down."
      }), "\n", _jsx(_components.p, {
        children: "The \"root\" or \"source\" plan is then returned back up the call stack. As the plan comes up the stack, each derived query appends its expression to the plan."
      }), "\n", _jsx(_components.pre, {
        children: _jsxs(_components.code, {
          className: "hljs language-typescript",
          children: [_jsx(_components.span, {
            className: "hljs-keyword",
            children: "abstract"
          }), " ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "class"
          }), " ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "DerivedQuery"
          }), " {\n  ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "readonly"
          }), " ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "expression"
          }), ": ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "DerivedExpression"
          }), " | ", _jsx(_components.span, {
            className: "hljs-literal",
            children: "null"
          }), ";\n  ...\n\n  ", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "plan"
          }), "(", _jsx(_components.span, {
            className: "hljs-params"
          }), ") {\n    ", _jsx(_components.span, {
            className: "hljs-comment",
            children: "// Ask the prior query to plan itself"
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "const"
          }), " plan = ", _jsx(_components.span, {
            className: "hljs-variable language_",
            children: "this"
          }), ".", _jsx(_components.span, {
            className: "hljs-property",
            children: "priorQuery"
          }), ".", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "plan"
          }), "();\n    ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "if"
          }), " (", _jsx(_components.span, {
            className: "hljs-variable language_",
            children: "this"
          }), ".", _jsx(_components.span, {
            className: "hljs-property",
            children: "expression"
          }), ") {\n      ", _jsx(_components.span, {
            className: "hljs-comment",
            children: "// append our expression to the plan"
          }), "\n      plan.", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "addDerivation"
          }), "(", _jsx(_components.span, {
            className: "hljs-variable language_",
            children: "this"
          }), ".", _jsx(_components.span, {
            className: "hljs-property",
            children: "expression"
          }), ");\n    }\n\n    ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "return"
          }), " plan;\n  }\n}\n\n", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "abstract"
          }), " ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "class"
          }), " ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "SourceQuery"
          }), " {\n  ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "readonly"
          }), " ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "expression"
          }), ": ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "SourceExpression"
          }), ";\n  ...\n\n  ", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "plan"
          }), "(", _jsx(_components.span, {
            className: "hljs-params"
          }), ") {\n    ", _jsx(_components.span, {
            className: "hljs-comment",
            children: "// We're the source query. Return a new plan with our source expression."
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "return"
          }), " ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "new"
          }), " ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "Plan"
          }), "(", _jsx(_components.span, {
            className: "hljs-variable language_",
            children: "this"
          }), ".", _jsx(_components.span, {
            className: "hljs-property",
            children: "expression"
          }), ", [])\n  }\n}\n"]
        })
      }), "\n", _jsx(_components.p, {
        children: "Lets look at thow this process works with a simple query: finding all users named \"Bill\"."
      }), "\n", _jsx(_components.pre, {
        children: _jsxs(_components.code, {
          className: "hljs language-javascript",
          children: [_jsx(_components.span, {
            className: "hljs-keyword",
            children: "const"
          }), " query = ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "User"
          }), ".", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "queryAll"
          }), "().", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "whereName"
          }), "(P.", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "equals"
          }), "(", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"Bill\""
          }), "));\n"]
        })
      }), "\n", _jsx(_components.p, {
        children: "This query would return a linked list that looks like:"
      }), "\n", _jsx("center", {
        children: _jsx(Mermaid, {
          id: "ggg",
          chart: `graph LR
UserQueryF["UserQuery(name == Bill)"] --> UserQuery
UserQuery --> SQLSourceQuery
`
        })
      }), "\n", _jsxs(_components.p, {
        children: [_jsx(_components.code, {
          children: "UserQuery(name == Bill)"
        }), " being the last node in the list and linked back to the prior queries."]
      }), "\n", _jsxs(_components.p, {
        children: [_jsx(_components.code, {
          children: "SQLSourceQuery"
        }), " is a new addition to the diagram. It is a query type that is returned by the query builder when creating a query not derived from a prior query. It represents the root and would be specific to the storage type that is kicking off the query. E.g., ", _jsx(_components.code, {
          children: "SQLSourceQuery"
        }), ", ", _jsx(_components.code, {
          children: "CypherSourceQuery"
        }), " or ", _jsx(_components.code, {
          children: "IndexDBSourceQuery"
        }), " would be some possibilities depending on where the source model type is stored."]
      }), "\n", _jsx(_components.p, {
        children: "The plan for this basic query would look like:"
      }), "\n", _jsx(_components.pre, {
        children: _jsxs(_components.code, {
          className: "hljs language-javascript",
          children: [_jsx(_components.span, {
            className: "hljs-title class_",
            children: "Plan"
          }), " {\n  ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "source"
          }), ": ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "SQLSourceExpression"
          }), "(table = users, db = example),\n  ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "derivations"
          }), ": [\n    ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "FilterExpression"
          }), "(name == ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "Bill"
          }), "),\n  ]\n}\n"]
        })
      }), "\n", _jsxs(_components.h2, {
        id: "a-more-complicated-walk",
        children: [_jsx(_components.a, {
          "aria-hidden": "true",
          tabIndex: "-1",
          href: "#a-more-complicated-walk",
          children: _jsx(_components.span, {
            className: "icon icon-link"
          })
        }), "A More Complicated Walk"]
      }), "\n", _jsx(_components.p, {
        children: "That simple plan isn't very illuminating so lets look at a more complicated query."
      }), "\n", _jsx(_components.pre, {
        children: _jsxs(_components.code, {
          className: "hljs language-javascript",
          children: [_jsx(_components.span, {
            className: "hljs-keyword",
            children: "const"
          }), " query = ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "User"
          }), ".", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "queryAll"
          }), "()\n  .", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "whereAge"
          }), "(P.", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "greaterThan"
          }), "(", _jsx(_components.span, {
            className: "hljs-number",
            children: "24"
          }), "))\n  .", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "whereName"
          }), "(P.", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "equals"
          }), "(", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"Matt\""
          }), "))\n  .", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "orderBy"
          }), "(", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "UserSpec"
          }), ".", _jsx(_components.span, {
            className: "hljs-property",
            children: "age"
          }), ")\n  .", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "take"
          }), "(", _jsx(_components.span, {
            className: "hljs-number",
            children: "5"
          }), ");\n"]
        })
      }), "\n", _jsx(_components.p, {
        children: "Which generates this list of linked queries:"
      }), "\n", _jsx("center", {
        children: _jsx(Mermaid, {
          id: "gfdf",
          chart: `graph TD
UserQueryT["UserQuery(take 5)"] --> UserQueryO["UserQuery(orderBy age)"]
UserQueryO --> UserQueryN["UserQuery(name == 'Matt')"]
UserQueryN --> UserQueryA["UserQuery(age > 24)"]
UserQueryA --> UserQuery
UserQuery --> SQLSourceQuery
`
        })
      }), "\n", _jsx(_components.p, {
        children: "Remember that the planning phase walks to the end of the list and returns a plan all the way back up the list.\nGiven that, the planning phase will convert the list of queries to:"
      }), "\n", _jsx(_components.pre, {
        children: _jsxs(_components.code, {
          className: "hljs language-javascript",
          children: [_jsx(_components.span, {
            className: "hljs-title class_",
            children: "Plan"
          }), " {\n  ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "source"
          }), ": ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "SQLSourceExpression"
          }), "(table = users, db = example),\n  ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "derivations"
          }), ": [\n    ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "FilterExpression"
          }), "(a > ", _jsx(_components.span, {
            className: "hljs-number",
            children: "24"
          }), "),\n    ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "FilterExpression"
          }), "(name == ", _jsx(_components.span, {
            className: "hljs-string",
            children: "'Matt'"
          }), "),\n    ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "OrderByExpression"
          }), "(age)\n    ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "TakeExpression"
          }), "(", _jsx(_components.span, {
            className: "hljs-number",
            children: "5"
          }), ")\n  ]\n}\n"]
        })
      }), "\n", _jsx(_components.p, {
        children: "What this plan says is to"
      }), "\n", _jsxs(_components.ol, {
        children: ["\n", _jsxs(_components.li, {
          children: ["Run the ", _jsx(_components.code, {
            children: "SQLSourceExpression"
          }), " then"]
        }), "\n", _jsx(_components.li, {
          children: "Run all subsequent expressions"
        }), "\n"]
      }), "\n", _jsx(_components.p, {
        children: "As you can see, the first step of query planning is very simple. It is just extracting and correctly ordering all of the expressions from the list of queries."
      }), "\n", _jsx(_components.p, {
        children: "Although I did say that there could be many plans from one list of queries."
      }), "\n", _jsx(_components.p, {
        children: "Multiple plans happen when we have \"hop queries\" or \"edge traversals.\" Planning also involves one more step called -- the optimization step."
      }), "\n", _jsx(_components.p, {
        children: "First we'll discuss hop queries and hop plans then we'll get into hoisting and plan optimization."
      }), "\n", _jsxs(_components.h2, {
        id: "hops-and-many-plans",
        children: [_jsx(_components.a, {
          "aria-hidden": "true",
          tabIndex: "-1",
          href: "#hops-and-many-plans",
          children: _jsx(_components.span, {
            className: "icon icon-link"
          })
        }), "Hops and Many Plans"]
      }), "\n", _jsxs(_components.p, {
        children: ["Hops (or edge traversals) are represented as separate ", _jsx(_components.code, {
          children: "HopPlans"
        }), ". If we build a query like the following:"]
      }), "\n", _jsx(_components.pre, {
        children: _jsxs(_components.code, {
          className: "hljs language-typescript",
          children: [_jsx(_components.span, {
            className: "hljs-keyword",
            children: "const"
          }), " query = ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "User"
          }), ".", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "queryAll"
          }), "()\n  .", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "whereName"
          }), "(P.", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "equals"
          }), "(", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"Bill\""
          }), "))\n  .", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "queryPhotos"
          }), "()\n  .", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "whereUploadDate"
          }), "(P.", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "greaterThan"
          }), "(", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "new"
          }), " ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "Date"
          }), "(", _jsx(_components.span, {
            className: "hljs-string",
            children: "\"2022-01-01\""
          }), ")))\n  .", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "queryComments"
          }), "();\n"]
        })
      }), "\n", _jsx(_components.p, {
        children: "We'll get this list of queries:"
      }), "\n", _jsx("center", {
        children: _jsx(Mermaid, {
          id: "xcxc",
          chart: `graph TD
CommentQuery --> HopQueryPC["HopQuery(PhotosToCommentsEdge)"]
HopQueryPC --> PhotosQueryUD["PhotosQuery(uploadDate > 2022-01-01)"]
PhotosQueryUD --> PhotosQuery
PhotosQuery --> HopQueryUP["HopQuery(UserToPhotosEdge)"]
HopQueryUP --> UserQueryN["UserQuery(name == Bill)"]
UserQueryN --> UserQuery
UserQuery --> SQLSourceQuery
`
        })
      }), "\n", _jsxs(_components.p, {
        children: ["Converting this to a plan works exactly the same as normal planning except every time we hit a hop, we wrap the plan it receives from the query before it into a ", _jsx(_components.code, {
          children: "HopPlan"
        }), "."]
      }), "\n", _jsx(_components.p, {
        children: "The basic implementation of hop planing is below --"
      }), "\n", _jsx(_components.pre, {
        children: _jsxs(_components.code, {
          className: "hljs language-typescript",
          children: [_jsx(_components.span, {
            className: "hljs-keyword",
            children: "abstract"
          }), " ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "class"
          }), " ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "DerivedQuery"
          }), " {\n  ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "readonly"
          }), " ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "expression"
          }), ": ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "DerivedExpression"
          }), " | ", _jsx(_components.span, {
            className: "hljs-literal",
            children: "null"
          }), ";\n  ...\n\n  ", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "plan"
          }), "(", _jsx(_components.span, {
            className: "hljs-params"
          }), ") {\n    ", _jsx(_components.span, {
            className: "hljs-comment",
            children: "// Derived queries add to plans rather than creating plans."
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-comment",
            children: "// Ask the prior query to plan itself"
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "const"
          }), " plan = ", _jsx(_components.span, {
            className: "hljs-variable language_",
            children: "this"
          }), ".", _jsx(_components.span, {
            className: "hljs-property",
            children: "priorQuery"
          }), ".", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "plan"
          }), "();\n    ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "if"
          }), " (", _jsx(_components.span, {
            className: "hljs-variable language_",
            children: "this"
          }), ".", _jsx(_components.span, {
            className: "hljs-property",
            children: "expression"
          }), ") {\n      ", _jsx(_components.span, {
            className: "hljs-comment",
            children: "// append our expression to the plan"
          }), "\n      plan.", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "addDerivation"
          }), "(", _jsx(_components.span, {
            className: "hljs-variable language_",
            children: "this"
          }), ".", _jsx(_components.span, {
            className: "hljs-property",
            children: "expression"
          }), ");\n    }\n\n    ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "return"
          }), " plan;\n  }\n}\n\n", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "abstract"
          }), " ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "class"
          }), " ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "SourceQuery"
          }), " {\n  ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "readonly"
          }), " ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "expression"
          }), ": ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "SourceExpression"
          }), ";\n  ...\n\n  ", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "plan"
          }), "(", _jsx(_components.span, {
            className: "hljs-params"
          }), ") {\n    ", _jsx(_components.span, {
            className: "hljs-comment",
            children: "// We're the source query. Return the plan with our source expression."
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "return"
          }), " ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "new"
          }), " ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "Plan"
          }), "(", _jsx(_components.span, {
            className: "hljs-variable language_",
            children: "this"
          }), ".", _jsx(_components.span, {
            className: "hljs-property",
            children: "expression"
          }), ", [])\n  }\n}\n\n", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "abstract"
          }), " ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "class"
          }), " ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "HopQuery"
          }), " {\n  ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "readonly"
          }), " ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "expression"
          }), ": ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "HopExpression"
          }), ";\n  ...\n  ", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "plan"
          }), "(", _jsx(_components.span, {
            className: "hljs-params"
          }), ") {\n    ", _jsx(_components.span, {
            className: "hljs-comment",
            children: "// HopQueries wrap the plans of their predecessors into HopPlans."
          }), "\n    ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "return"
          }), " ", _jsx(_components.span, {
            className: "hljs-keyword",
            children: "new"
          }), " ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "HopPlan"
          }), "(", _jsx(_components.span, {
            className: "hljs-variable language_",
            children: "this"
          }), ".", _jsx(_components.span, {
            className: "hljs-property",
            children: "priorQuery"
          }), ".", _jsx(_components.span, {
            className: "hljs-title function_",
            children: "plan"
          }), "(), ", _jsx(_components.span, {
            className: "hljs-variable language_",
            children: "this"
          }), ".", _jsx(_components.span, {
            className: "hljs-property",
            children: "expression"
          }), ", []);\n  }\n}\n"]
        })
      }), "\n", _jsx(_components.p, {
        children: "Based on that, our multi-hop example would generate the following plan:"
      }), "\n", _jsx(_components.pre, {
        children: _jsxs(_components.code, {
          className: "hljs language-javascript",
          children: [_jsx(_components.span, {
            className: "hljs-title class_",
            children: "HopPlan"
          }), " {\n  ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "sourcePlan"
          }), ": ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "HopPlan"
          }), " {\n    ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "sourcePlan"
          }), ": ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "Plan"
          }), " {\n      ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "source"
          }), ": ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "SQLSourceExpression"
          }), "(table = users, db = example),\n      ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "derivations"
          }), ": [\n        ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "FilterExpression"
          }), "(name == ", _jsx(_components.span, {
            className: "hljs-string",
            children: "'Matt'"
          }), "),\n      ],\n    },\n    ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "hopExpression"
          }), ": ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "SQLHopExpression"
          }), "(", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "UserToPhotosEdge"
          }), "),\n    ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "derivations"
          }), ": [\n      ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "FilterExpression"
          }), "(uploadDate > ", _jsx(_components.span, {
            className: "hljs-string",
            children: "'2022-01-01'"
          }), "),\n    ],\n  },\n  ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "hopExpression"
          }), ": ", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "SQLHopExpression"
          }), "(", _jsx(_components.span, {
            className: "hljs-title class_",
            children: "PhotosToCommentsEdge"
          }), ")\n  ", _jsx(_components.span, {
            className: "hljs-attr",
            children: "derivations"
          }), ": []\n}\n"]
        })
      }), "\n", _jsx(_components.p, {
        children: "Or, visually:"
      }), "\n", _jsx("center", {
        children: _jsx(Mermaid, {
          id: "hjh",
          chart: `graph LR
HopPlan["HopPlan(PhotosToCommentsEdge)"] --> HopPlanUP["HopPlan(UserToPhotosEdge)"]
HopPlanUP --> Plan["Plan(SQLSourceExpression(table = users, db = example))"]
`
        })
      }), "\n", _jsx(_components.p, {
        children: "This follows a similar pattern to our query builder in that each hop plan has a pointer to the plan before it, creating a linked list of plans."
      }), "\n", _jsxs(_components.p, {
        children: ["Hops get their own plans since they're often operating on different tables or even different databases or storage types altogether. I.e., you can hop from a ", _jsx(_components.code, {
          children: "SQL"
        }), " node to an ", _jsx(_components.code, {
          children: "IndexDB"
        }), " node and back."]
      }), "\n", _jsx(_components.p, {
        children: "This splitting of plans begs the question: how we can do a global optimization across all plans and create a single plan of execution?"
      }), "\n", _jsxs(_components.h1, {
        id: "optimization",
        children: [_jsx(_components.a, {
          "aria-hidden": "true",
          tabIndex: "-1",
          href: "#optimization",
          children: _jsx(_components.span, {
            className: "icon icon-link"
          })
        }), "Optimization"]
      }), "\n", _jsxs(_components.p, {
        children: ["That brings us to query plan optimization. Written as a separate post in the series here: ", _jsx(_components.a, {
          href: "./2022-05-26-query-plan-optimization",
          children: "Query Plan Optimization"
        }), "."]
      })]
    });
  }
}
export default MDXContent;
