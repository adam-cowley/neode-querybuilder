import Builder, { Direction, WhereStatement, } from '../src'

function builder() : Builder<any> {
    return new Builder()
}


/**
 * Find an actor and 10 movies that they've acted in
 * 
 * MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
 * WHERE m.released >= 2003
 * RETURN p, m
 * LIMIT 10
 */

const actorAndMovies = builder()
    .match('p', 'Person', { name: 'Keanu Reeves' })
    .relationship('ACTED_IN', Direction.OUTGOING)
    .to('m', 'Movie')
    .whereGreaterThanOrEqual('m.released', 2003)
    .return('p', 'm')
    .limit(10)

console.log('actorAndMovies:')
console.log(actorAndMovies.toString()) // MATCH (p:Person)-[:ACTED_IN]->(m:Movie) ...
console.log(actorAndMovies.getParams()) // { p_name: 'Keanu Reeves', m_released: Integer { low: 2003, high: 0 } }

/**
 * A more complex query using WhereStatement object
 * MATCH (p:Person {name: $p_name})-[:ACTED_IN]->(m:Movie)
 * WHERE (
 *  m.title CONTAINS $Matrix AND m.released > $matrixReleasedBefore
 * )
 * OR (
 *  m.title ENDS WITH $Atlas AND m.released <= $atlasReleasedBefore
 * )
 * RETURN p, m
 * LIMIT 10
 */


const complexWhere = builder()

// First add the parameters to the builder
complexWhere.setParam('matrixReleasedAfter', 2000)
complexWhere.setParam('atlasReleasedBefore', 2000)

// Then create new instances of WhereStatement using those parameters
complexWhere
    .match('p', 'Person', { name: 'Keanu Reeves' })
    .relationship('ACTED_IN', Direction.OUTGOING)
    .to('m', 'Movie')
    .where(
        (new WhereStatement())
            .whereContains('m.title', 'Matrix')
            .whereGreaterThan('m.released', 'matrixReleasedBefore')
    )
    .or(
        (new WhereStatement())
            .whereEndsWith('m.title', 'Atlas')
            .whereLessThanOrEqual('m.released', 'atlasReleasedBefore')
    )
    .return('p', 'm')
    .limit(10)


console.log('\n\ncomplexWhere')
console.log(complexWhere.toString())
console.log(complexWhere.getParams()) // { matrixReleasedAfter: 2000, atlasReleasedBefore: 2000, p_name: 'Keanu Reeves' }


/**
 * APOC Periodic Iterate
 * 
 * CALL apoc.periodic.iterate("MATCH (n) RETURN n", "DETACH DELETE n", {iterateList: true, parallel: true, batchSize: 1000})
 * YIELD total, batches, timeTaken
 * WHERE (total > $total)
 * RETURN total, batches, timeTaken
 */
const apocPeriodicIterate = builder()
    .call('apoc.periodic.iterate', 'MATCH (n) RETURN n', 'DETACH DELETE n', { iterateList: true, parallel: true, batchSize: 1000 })
    .yield('total', 'batches', 'timeTaken')
    .whereGreaterThan('total', 10)
    .return('total', 'batches', 'timeTaken')

console.log('\n\napocPeriodicIterate:')
console.log(apocPeriodicIterate.toString()) // CALL apoc.periodic.iterate ...
console.log(apocPeriodicIterate.getParams()) // { total: Integer { low: 10, high: 0 } }