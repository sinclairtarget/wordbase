# Wordbase Backend
## `GET /ping`
Returns the literal string `PONG`.

## `GET /api/entries`
Returns all stored entries as a JSON array.

### `200`:
```
[
    {
        "word": "Gable",
        "definition": "The triangular ends of a house under the roof.",
        "location": "/api/entries/Gable",
        "updated_at": ""
    },
    ...
]
```

## `GET /api/entries/:slug`
Returns the entry with the given slug as a JSON object.

### `200`:
```
{
    "word": "Gable",
    "definition": "The triangular ends of a house under the roof.",
    "location": "/api/entries/Gable",
    "updated_at": ""
}
```

### `404`:
No word exists with that slug.
