export declare enum Condition {
    DEFAULT = "",
    WHERE = "WHERE ",
    OR = "OR "
}
export declare enum Direction {
    INCOMING = 0,
    OUTGOING = 1,
    BOTH = 2
}
export declare enum Operator {
    EQUALS = "=",
    LIKE = "LIKE",
    CONTAINS = "CONTAINS",
    STARTS_WITH = "STARTS WITH",
    ENDS_WITH = "ENDS WITH",
    GREATER_THAN = ">",
    GREATER_THAN_OR_EQUAL = ">=",
    LESS_THAN = "<",
    LESS_THAN_OR_EQUAL = "<="
}
export declare enum Order {
    ASC = "ASC",
    DESC = "DESC"
}
export declare enum Prefix {
    AND = "AND ",
    OR = "OR ",
    DEFAULT = "AND "
}
export declare enum SetOperator {
    EQUALS = "=",
    APPEND_EQUALS = "+="
}
export declare enum StatementPrefix {
    MATCH = "MATCH",
    OPTIONAL_MATCH = "OPTIONAL MATCH",
    WITH = "WITH",
    CALL = "CALL",
    CREATE = "CREATE",
    MERGE = "MERGE",
    DETACH_DELETE = "DETACH DELETE"
}
