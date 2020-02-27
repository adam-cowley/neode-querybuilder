export enum Condition {
    DEFAULT = "",
    WHERE = "WHERE ",
    OR = "OR ", 
}

export enum Direction {
    INCOMING,
    OUTGOING,
    BOTH,
}

export enum Operator {
    EQUALS = "=",
    LIKE = "LIKE",
    CONTAINS = "CONTAINS",
    STARTS_WITH = "STARTS WITH",
    ENDS_WITH = "ENDS WITH",

    GREATER_THAN = ">",
    GREATER_THAN_OR_EQUAL = ">=",
    LESS_THAN = "<",
    LESS_THAN_OR_EQUAL = "<=",
}

export enum Order {
    ASC = "ASC",
    DESC = "DESC",
}

export enum Prefix {
    AND = "AND ",
    OR = "OR ",
    DEFAULT = "AND ",
}

export enum SetOperator {
    EQUALS = "=",
    APPEND_EQUALS = "+=",
}

export enum StatementPrefix {
    MATCH = 'MATCH',
    OPTIONAL_MATCH = 'OPTIONAL MATCH',
    WITH = 'WITH',
    CALL = 'CALL',

    CREATE = "CREATE",
    MERGE = "MERGE",
    DETACH_DELETE = "DETACH DELETE",
}
