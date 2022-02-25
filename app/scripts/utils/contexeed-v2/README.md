# Contexeed v2

Contexeed can be used to create a reducer and actions to manage api calls.

**More documentation to come**

```js
// Values returned by useContexeedApi
const {
  /* All the request thunks defined in the config */
  ...requestThunks,
  /* All the mutation thunks defined in the config */
  ...mutationThunks,
  /** Invalidate action already dispatchable. If contexeed is defined as a
   * slicedState a key will be required. */
  invalidate,
  /** Function to get the current state. If contexeed is defined as a
   * slicedState a key will be required and the returned state will be a state
   * slice. */
  getState,
  /** The state in raw format as stored in the reducer. */
  rawState,
  /** The reducer's dispatch function. It supports dispatching thunks. */
  dispatch
} = useContexeedApi(options);
```

All the options accepted by useContexeedApi() can be found in `types.ts` under `ContexeedApiConfig`

## Example

```js
  const {
    getState,
    fetchAll,
    fetchOne,
    updateOne,
    deleteOne
  } = useContexeedApi({
    name: 'myData',
    requests: {
      fetchAll: () => ({
        url: '/example'
      }),
      fetchOne: (id) => ({
        url: `/example/${id}`
      })
    },
    mutations: {
      updateOne: (id, data) => ({
        url: `/example/${id}`,
        requestOptions: {
          method: 'post',
          data
        }
      }),
      deleteOne: (id) => ({
        url: `/example/${id}`,
        requestOptions: {
          method: 'delete'
        },
        onDone: (finish, { error, invalidate }) => {
          // When we delete something we want to invalidate the state.
          return !error ? invalidate() : finish();
        }
      }),
      // If no hook functions are provided, this is the default.
      defaultWithAllSteps: () => {
        url: `/example`,
        requestOptions: {
          method: 'post'
          headers: {
            Authorization: 'Bearer something'
          },
          data: {
            title: 'Some title'
          }
        },
        overrideRequest: async ({ axios, requestOptions }) => {
          const response =  await axios({
            url: `/example`,
            ...requestOptions
          });

          // By default the data part of the axios response is passed to transformData.
          return response.data;
        },
        transformData: (data) => {
          return data;
        }),
        transformError: (error) => {
          return error;
        }),
        onDone: (finish) => {
          return finish();
        })
      }
    }
  });
```