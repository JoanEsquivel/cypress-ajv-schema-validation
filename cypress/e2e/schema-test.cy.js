// More examples at: 
// https://github.com/sclavijosuero/cypress-ajv-schema-validator/blob/main/USAGE-EXAMPLES.md

//Petstore json: https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml
//Petstore Swagger: https://petstore3.swagger.io/


const schemaV3 = {
    "openapi": "3.0.2",
    "paths": {
        "/store/inventory": {
            "get": {
                "tags": ["store"],
                "summary": "Returns pet inventories by status",
                "description": "Returns a map of status codes to quantities",
                "operationId": "getInventory",
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "additionalProperties": {
                                        "type": "integer",
                                        "format": "int32"
                                    }
                                }
                            }
                        }
                    }
                },
                "security": [
                    { "api_key": [] }
                ]
            }
        },
        "/pet/{petId}": {
            "get": {
                "tags": ["pet"],
                "summary": "Find pet by ID",
                "description": "Returns a single pet",
                "operationId": "getPetById",
                "parameters": [
                    {
                        "name": "petId",
                        "in": "path",
                        "description": "ID of pet to return",
                        "required": true,
                        "schema": {
                            "type": "integer",
                            "format": "int64"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "content": {
                            "application/xml": {
                                "schema": { "$ref": "#/components/schemas/Pet" }
                            },
                            "application/json": {
                                "schema": { "$ref": "#/components/schemas/Pet" }
                            }
                        }
                    },
                    "400": { "description": "Invalid ID supplied" },
                    "404": { "description": "Pet not found" }
                },
                "security": [
                    { "api_key": [] },
                    { "petstore_auth": ["write:pets", "read:pets"] }
                ]
            }
        }
    },
    "components": {
        "schemas": {
            "Pet": {
                "required": ["name", "photoUrls"],
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64",
                        "example": 10
                    },
                    "name": {
                        "type": "string",
                        "example": "doggie"
                    },
                    "category": {
                        "$ref": "#/components/schemas/Category"
                    },
                    "photoUrls": {
                        "type": "array",
                        "xml": {
                            "wrapped": true
                        },
                        "items": {
                            "type": "string",
                            "xml": {
                                "name": "photoUrl"
                            }
                        }
                    },
                    "tags": {
                        "type": "array",
                        "xml": {
                            "wrapped": true
                        },
                        "items": {
                            "$ref": "#/components/schemas/Tag",
                            "xml": {
                                "name": "tag"
                            }
                        }
                    },
                    "status": {
                        "type": "string",
                        "description": "pet status in the store",
                        "enum": ["available", "pending", "sold"]
                    }
                },
                "xml": {
                    "name": "pet"
                },
                "type": "object"
            },
            "Category": {
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64",
                        "example": 1
                    },
                    "name": {
                        "type": "string",
                        "example": "Dogs"
                    }
                },
                "xml": {
                    "name": "category"
                },
                "type": "object"
            },
            "Tag": {
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "xml": {
                    "name": "tag"
                },
                "type": "object"
            }
        }
    }
};


const petPath = { endpoint: '/pet/{petId}', method: 'GET', status: 200 };


describe('API Schema Validation with OpenAPI 3.0.2', () => {
    it('should validate the pet data using OpenAPI 3.0.2 schema', () => {
        cy.request('GET', 'https://petstore3.swagger.io/api/v3/pet/1').validateSchema(schemaV3, petPath)
    })
})