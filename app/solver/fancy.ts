import { buildMetadata, getInfoFromResult, allwords } from "./basic";
// Fany solver...

/*
 * So for our fancy solver, we want to rate guesses by how much information
 * they provide us.
 *
 * So guessing a green square provides 0 new information.
 * Guessing a yellow square provides some, and so on...
 * We guess maximal information guesses until we have one word left.
 *
 * Given a possible wordlist, how do we determine what letter gives the
 * most information?
 *
 * Let's say we know there's an E at the end of the word and a C at the start.
 *
 * CLOSE
 * CLAVE
 * CRONE
 * CRAVE
 * CRATE
 * CREPE
 * CHASE
 * CHAFE
 *
 */
