/* STORY: you are the ghost of Professor Gartner. The Itadori family has 3 days to settle in. Drive them out. */
const INTRO=["Professor Gartner spent his life in this house and swore ghosts were nonsense.",
"He died in a fire at 4:59. Now he is the thing he mocked, and sunlight burns him.",
"The Itadori family bought his house. If they last three days, it is theirs. Drive them out."];
const MEM={clock:"It stopped at 4:59. My last minute.",dmirror:"I hid my research behind this glass.",toys:"My sister's toys. I never threw them out.",
books:"Forty years of notes. Nobody reads them.",ward:"My wife's dresses. I never gave them away."};
const DAYS=[['Day 1: First Light','The Itadoris moved in this morning.','Dad does not believe in ghosts. Haunt things near him until his fear bar is full.'],
['Day 2: Stopped Clock','Two days left.','Scare two family members until both show 2 fear pips at the same moment.'],
['Day 3: Sunset','The last day. Fear fades, so move fast.','Scare all three, one after another, until all show 2 fear pips at once. Then decide their fate.']];
const MISS=['Fill Dad\'s 3 fear pips','2 people at 2+ fear pips','All 3 at 2+ fear pips'];
const ENDS=[{id:'alone',t:'Alone at Last',e:'The house is yours again. It has never been so quiet.',h:'Drive them out. No mercy.'},
{id:'rooms',t:'Roommates',e:'The Itadoris stay. So does the ghost in the study.',h:'Be someone they could live with.'},
{id:'rest',t:'Rest at Last',e:'The clock strikes five. Gartner finally lets go.',h:'Remember everything. Then let go.'},
{id:'ashes',t:'Ashes',e:'Fire took the house once. This time he chose it.',h:'Fire remembers.'},
{id:'signed',t:'Signed',e:'Time ran out. The deed belongs to the Itadoris.',h:'Do not run out the clock.'},
{id:'exorcised',t:'Exorcised',e:'A bell rings through the halls. The house falls silent.',h:'Do not be seen too often.'},
{id:'proof',t:'Proof',e:'Dad saw it with his own eyes. Ghosts are real.',h:'Some doubters need a witness.'}];
function cap(who,text){if(g.q.length<3)g.q.push({who,text,t:0,life:4.5})}
function bark(p){if(g.bk++)return;const L=day==3?{Dad:"We have nowhere else to go.",Mom:"Please. We just want a home.",Kid:"He sounds sad, not angry."}
:{Dad:"Did you hear that?!",Mom:"This house is haunted!",Kid:"Mom? The mirror moved!"};cap(p.n,L[p.n])}