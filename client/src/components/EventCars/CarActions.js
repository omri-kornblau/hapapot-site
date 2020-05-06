const Actions = {
  DELETE: "delete",
  EDIT_MAX_PASSENGERS: "editMaxPassengers",
  SAVE: "save",
  EXIT: "exit",
}

const useActions = dispatch => ({
  delete: _id => {
    dispatch({
      type: Actions.DELETE,
      _id
    })
  },
  editMaxPassengers: (_id, maxPassengers) => {
    dispatch({
      type: Actions.EDIT_MAX_PASSENGERS,
      value: maxPassengers,
      _id
    })
  },
  save: () => {
    dispatch({
      type: Actions.SAVE
    })
  },
  exit: () => {
    dispatch({
      type: Actions.EXIT
    })
  },
});

export {
  Actions,
  useActions
}