# Wttj

## Requirements

- Elixir 1.17.2-otp-27
- Erlang 27.0.1
- Nodejs 20.11.0
- PostgreSQL
- Yarn

## Getting started

You can start the project the same as you sent me.

To start your Phoenix server: `mix phx.server`
To start the React app: `yarn dev`

## Testing

You can run `yarn coverage` to run tests and see the coverage.

## Installed library

- @dnd-kit (@dnd-kit/modifiers / @dnd-kit/sortable) – a lightweight React library for building performant and accessible drag and drop experiences.
- @nock - HTTP server mocking and expectations library for Node.js.
  I chose this one because I wanted to test a React hook with HTTP requests and found this in the TanStack Query documentation.

## Architecture overview

- utils folder: as you know, it's for utility functions.
- components folder: I added Dnd to store all the components needed for drag and drop. Also, a UI folder for general components like Alert.

The rest remains unchanged.

## Error

I faced a performance issue that occurred when I switched a card between columns (rapidly).
The card is duplicated. I suppose that the problem is when switching columns, the `sortedCandidates` is not updated yet. After some tests with the original example, I found that it had a similar issue, but in its case, it created a blank card.

!! Bad trade-off in this case. I spent too much time trying to find the best optimization.

Maybe try multiple libraries before committing to one.

## Technical decision

When using the mutation to update a candidate, the position has to be unique.
So when we change a candidate to another column, the candidate can have the same position.
I saw the magic number on the back part, so I decided to calculate the new position like this: (prevCardPosition + nextCardPosition) / 2.
So like this, the new position is always between the 2 other candidates.

For the rest it's playing with different index and column name to move and update the candidate.

## Future improvements

Future improvements that can be done:

- Refactor the candidate component to remove useSortable and remove the dependency between the library and the candidate. `<div ref={setNodeRef}>{children}</div>`
- Refactor moveBetweenContainers to be a pure function.
- Check between moveBetweenContainers, handleDragMove, and handleDragEnd to see the potential refactor. Potentially remove duplicate code and create more utility functions.
- I wanted to get better performance but didn't really find the right way. Maybe trying with some useRef and useMemo to not re-render the component.
- Improve the mutation `useUpdateCandidate`. Keep the previous data on the context mutation. Use setQueryData on the onError mutation to reset the data to the previous version with the context. Use invalidateQueries on the onSettled mutation.
- Document more after refactor.
- More unit tests.

And more:

- Add a library like i18next to translate the app (a11y)
- Possibility to add columns.
- Add candidate information to get more relevant cards.
- Possibility to add new candidates.
- Drag and drop column order.
- Adding a drag overlay.
- Adding the possibility to change the card statuses with an option list, directly on the card, or with a button that opens a modal.
