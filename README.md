# plantsAPP API

#### Backend server for the plantsAPP, with auth and mongoose relationships etc. 

## Entities 

```js
User is comprised of the following:

		email: {
			type: String,
			required: true,
			unique: true,
		},
		hashedPassword: {
			type: String,
			required: true,
		},
		token: String,
```

```js
Plant is comprised of the following:

		name: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true,
		}
		
```

## Routes 

### AUTH Routes

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| PATCH  | `/change-password/` | `users#changepw`  |
| DELETE | `/sign-out/`        | `users#signout`   |


### Plant Routes

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| GET   | `/plants`             | `plants#index`    |
| GET   | `/plants/:id`             | `plants#show`    |
| POST   | `/plants`             | `plants#create`    |
| PATCH  | `/plants/:id` | `pets#update`  |
| DELETE | `/plants/:id`        | `plants#delete`   |




