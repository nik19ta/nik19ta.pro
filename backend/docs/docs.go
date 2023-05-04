// Code generated by swaggo/swag. DO NOT EDIT.

package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/api/auth/sign-in": {
            "post": {
                "description": "Log in to the admin panel, get a token",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Auth"
                ],
                "summary": "Sign Up",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.SingUpResp"
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "401": {
                        "description": "Unauthorized"
                    }
                }
            }
        },
        "/api/projects": {
            "get": {
                "description": "Get list Projects",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Projects"
                ],
                "summary": "Get list  Projects",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.ProjectsResp"
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    }
                }
            }
        },
        "/api/projects/{id}": {
            "get": {
                "description": "Get information about the project by its ID and language, if specified",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Projects"
                ],
                "summary": "Get information about the project by id",
                "parameters": [
                    {
                        "type": "string",
                        "description": "project ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "Project language (English by default)",
                        "name": "lang",
                        "in": "query"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.ProjectResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "404": {
                        "description": "Not Found"
                    }
                }
            }
        },
        "/api/stat/clicks": {
            "get": {
                "description": "Get how many times clicked on links",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Stat"
                ],
                "summary": "Get statistics by link",
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "400": {
                        "description": "Bad Request"
                    }
                }
            }
        },
        "/api/stat/projects": {
            "get": {
                "description": "Get project visits by day in 30 days",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Stat"
                ],
                "summary": "Get project statistics",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/definitions/models.ProjectsStats"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/stat/update/projects/{uuid}": {
            "put": {
                "description": "Increments the number of project visits by 1 for the current day",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Stat"
                ],
                "summary": "Updating the statistics of visits to the project",
                "parameters": [
                    {
                        "type": "string",
                        "description": "project id",
                        "name": "uuid",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful statistics update"
                    }
                }
            }
        },
        "/api/stat/update/visit": {
            "put": {
                "description": "add a visit to the site, gets the IP, country, time of entry and uniqueness of the visit",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Stat"
                ],
                "summary": "add a visit",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Unique visit or not (0 - not unique, 1 - unique)",
                        "name": "un",
                        "in": "query",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "UTM tag ID (optional parameter)",
                        "name": "utm",
                        "in": "query"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful registration of the session and return of the session ID",
                        "schema": {
                            "$ref": "#/definitions/models.SessionResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    }
                }
            }
        },
        "/api/stat/updatevisit/extend": {
            "put": {
                "description": "Extends the time spent on the site by session ID",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Stat"
                ],
                "summary": "Extending the time spent on the site",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Session ID",
                        "name": "session",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "400": {
                        "description": "Bad Request"
                    }
                }
            }
        },
        "/api/stat/visits": {
            "get": {
                "description": "Get information about site visits, including the number of visits, unique visits, top countries, top browsers and top OS",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Stat"
                ],
                "summary": "Get session statistics",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.VisitsResponse"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "models.ProjectResponse": {
            "type": "object",
            "properties": {
                "cards": {
                    "type": "string"
                },
                "categories": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    }
                },
                "description": {
                    "type": "string"
                },
                "features": {
                    "type": "string"
                },
                "id": {
                    "type": "string"
                },
                "photos": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    }
                },
                "subtitle": {
                    "type": "string"
                },
                "title": {
                    "type": "string"
                },
                "url": {
                    "type": "string"
                }
            }
        },
        "models.ProjectsResp": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.ProjectsResponse"
                    }
                }
            }
        },
        "models.ProjectsResponse": {
            "type": "object",
            "properties": {
                "categories": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    }
                },
                "id": {
                    "type": "string"
                },
                "subtitle": {
                    "type": "string"
                },
                "title": {
                    "type": "string"
                },
                "url": {
                    "type": "string"
                }
            }
        },
        "models.ProjectsStats": {
            "type": "object",
            "properties": {
                "count": {
                    "type": "integer"
                },
                "date": {
                    "type": "string"
                },
                "uuid": {
                    "type": "string"
                }
            }
        },
        "models.SessionResponse": {
            "type": "object",
            "properties": {
                "session": {
                    "type": "string"
                }
            }
        },
        "models.SingUpResp": {
            "type": "object",
            "properties": {
                "token": {
                    "type": "string"
                }
            }
        },
        "models.SiteStats": {
            "type": "object",
            "properties": {
                "avg_time_on_site": {
                    "description": "Average time spent on the site",
                    "type": "integer"
                },
                "top_browsers": {
                    "description": "Top browsers",
                    "type": "object",
                    "additionalProperties": {
                        "type": "integer"
                    }
                },
                "top_countries": {
                    "description": "Top countries",
                    "type": "object",
                    "additionalProperties": {
                        "type": "integer"
                    }
                },
                "top_os": {
                    "description": "Top Operating systems",
                    "type": "object",
                    "additionalProperties": {
                        "type": "integer"
                    }
                },
                "total_visits": {
                    "description": "Visits",
                    "type": "integer"
                },
                "total_visits_by_day": {
                    "description": "Visits per day",
                    "type": "object",
                    "additionalProperties": {
                        "type": "integer"
                    }
                },
                "unique_visits": {
                    "description": "Unique visits",
                    "type": "integer"
                },
                "unique_visits_by_day": {
                    "description": "Unique visits per day",
                    "type": "object",
                    "additionalProperties": {
                        "type": "integer"
                    }
                },
                "visits_details_by_days": {
                    "description": "Full statistics of visits by users",
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.VisitsDetails"
                    }
                }
            }
        },
        "models.Visits": {
            "type": "object",
            "properties": {
                "browser": {
                    "description": "Browser (Chrome, Firefox, etc.)",
                    "type": "string"
                },
                "country": {
                    "description": "Short country code (EE, DE, etc.)",
                    "type": "string"
                },
                "ip": {
                    "description": "The IP address from which",
                    "type": "string"
                },
                "os": {
                    "description": "Operating system (Windows, macOS, etc.)",
                    "type": "string"
                },
                "platform": {
                    "description": "Platform (Linux, Macintosh, iPhone)",
                    "type": "string"
                },
                "time_entry": {
                    "description": "The time at which the person entered",
                    "type": "string"
                },
                "time_leaving": {
                    "description": "The time when the user left the site",
                    "type": "string"
                },
                "uid": {
                    "description": "Unique identifier",
                    "type": "string"
                },
                "unique": {
                    "description": "Has the user already logged in or not",
                    "type": "boolean"
                },
                "utm": {
                    "description": "the UTM tag id came in",
                    "type": "string"
                }
            }
        },
        "models.VisitsDetails": {
            "type": "object",
            "properties": {
                "date": {
                    "description": "Date",
                    "type": "string"
                },
                "details": {
                    "description": "Details",
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.Visits"
                    }
                }
            }
        },
        "models.VisitsResponse": {
            "type": "object",
            "properties": {
                "data": {
                    "$ref": "#/definitions/models.SiteStats"
                }
            }
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "",
	Host:             "",
	BasePath:         "",
	Schemes:          []string{},
	Title:            "",
	Description:      "",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}