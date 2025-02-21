import {Context} from "hono";
import {createState} from "../src/server/StateHandler";

type State = Array<{ id: number, name: string }>;
const state = createState<State>('umsatz', () => [])

export const umsatz = [
    {
        path: '',
        method: 'GET',
        response: {
            type: 'dynamic',
            handler() {
                return Response.json(state.getState())
            }
        },
        state
    },
    {
        path: ':id',
        method: 'PUT',
        response: {
            type: 'dynamic',
            async handler(context: Context) {
                const id = context.req.param('id')
                const index = state.getState().findIndex((umsatz) => umsatz.id == Number(id))
                const body = await context.req.json()

                if (index !== -1) {
                    state.getState()[index] = body
                    return Response.json(state.getState()[index])
                } else {
                    return Response.json({}, { status: 404 })
                }
            }
        },
        state
    },
    {
        path: '',
        method: 'POST',
        response: {
            type: 'dynamic',
            async handler(context: Context) {
                const body = await context.req.json()
                state.getState().push(body)
                return Response.json(state.getState())
            }
        },
        state
    }
]