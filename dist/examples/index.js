"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = __importStar(require("../src"));
function builder() {
    return new src_1.default();
}
/**
 * Find an actor and 10 movies that they've acted in
 *
 * MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
 * WHERE m.released >= 2003
 * RETURN p, m
 * LIMIT 10
 */
var actorAndMovies = builder()
    .match('p', 'Person', { name: 'Keanu Reeves' })
    .relationship('ACTED_IN', src_1.Direction.OUTGOING)
    .to('m', 'Movie')
    .whereGreaterThanOrEqual('m.released', 2003)
    .return('p', 'm')
    .limit(10);
console.log('actorAndMovies:');
console.log(actorAndMovies.toString()); // MATCH (p:Person)-[:ACTED_IN]->(m:Movie) ...
console.log(actorAndMovies.getParams()); // { p_name: 'Keanu Reeves', m_released: Integer { low: 2003, high: 0 } }
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
var complexWhere = builder();
// First add the parameters to the builder
complexWhere.setParam('matrixReleasedAfter', 2000);
complexWhere.setParam('atlasReleasedBefore', 2000);
// Then create new instances of WhereStatement using those parameters
complexWhere
    .match('p', 'Person', { name: 'Keanu Reeves' })
    .relationship('ACTED_IN', src_1.Direction.OUTGOING)
    .to('m', 'Movie')
    .where((new src_1.WhereStatement())
    .whereContains('m.title', 'Matrix')
    .whereGreaterThan('m.released', 'matrixReleasedBefore'))
    .or((new src_1.WhereStatement())
    .whereEndsWith('m.title', 'Atlas')
    .whereLessThanOrEqual('m.released', 'atlasReleasedBefore'))
    .return('p', 'm')
    .limit(10);
console.log('\n\ncomplexWhere');
console.log(complexWhere.toString());
console.log(complexWhere.getParams()); // { matrixReleasedAfter: 2000, atlasReleasedBefore: 2000, p_name: 'Keanu Reeves' }
/**
 * APOC Periodic Iterate
 *
 * CALL apoc.periodic.iterate("MATCH (n) RETURN n", "DETACH DELETE n", {iterateList: true, parallel: true, batchSize: 1000})
 * YIELD total, batches, timeTaken
 * WHERE (total > $total)
 * RETURN total, batches, timeTaken
 */
var apocPeriodicIterate = builder()
    .call('apoc.periodic.iterate', 'MATCH (n) RETURN n', 'DETACH DELETE n', { iterateList: true, parallel: true, batchSize: 1000 })
    .yield('total', 'batches', 'timeTaken')
    .whereGreaterThan('total', 10)
    .return('total', 'batches', 'timeTaken');
console.log('\n\napocPeriodicIterate:');
console.log(apocPeriodicIterate.toString()); // CALL apoc.periodic.iterate ...
console.log(apocPeriodicIterate.getParams()); // { total: Integer { low: 10, high: 0 } }
