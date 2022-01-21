
import { HmacSHA256, enc } from "crypto-js";
import Decimal from "decimal.js";

enum BOX_TYPE {
    Gold = 0,
    Platinum = 1,
    Diamond = 2
}

const GOLDEN_INT_PROB: number[] = [0.0000, 0.00006, 0.0006, 0.0009, 0.002, 0.004, 0.01, 0.0285, 0.05, 0.09, 0.21, 0.60394]
const PLATINUM_INIT_PROB: number[] = [0.00005, 0.00008, 0.0008, 0.0012, 0.003, 0.007, 0.015, 0.035, 0.06, 0.1, 0.22, 0.55787]
const DIAMOND_INIT_PROB: number[] = [0.0003, 0.001, 0.0015, 0.003, 0.005, 0.015, 0.022, 0.043, 0.07, 0.115, 0.235, 0.4902]
const RUNE_NAMES: string[] = ['Paranium', 'Pythium', 'Crypton', 'Onixius', 'Gem', 'Metal', 'Crystal', 'Plastic', 'Rubber', 'Wood', 'Stone', 'Soil'];

const G_WEIGHT = [1, 1, 2, 3, 4, 4, 5, 5, 6, 7, 7, 5];
const P_WEIGHT = [1, 2, 3, 4, 5, 6, 6, 6, 7, 10, 10, 10];
const D_WEIGHT = [2, 3, 4, 5, 6, 7, 8, 10, 10, 15, 15, 15];
const TOTAL_RUNE_TYPE = RUNE_NAMES.length

//generate seed
const SeedGenerator = (params: { address: string, blockHash: string, boxId: number, turn: number }, n: number = 0): string => {
    const { address, blockHash, boxId, turn } = params
    // console.log(turn)
    if (turn < 0 || turn > 2) throw new Error(`turn must be 0|1|2`)
    const hmac = HmacSHA256(`${address}:${blockHash}:${boxId}:${turn.toString()}`, n.toString());
    return hmac.toString(enc.Hex);
}
const GetBoundNumberByType = (box_type: number) => {
    switch (box_type) {
        case BOX_TYPE.Gold:
            return [30, 40, 50]
        case BOX_TYPE.Platinum:
            return [40, 50, 70]
        case BOX_TYPE.Diamond:
            return [60, 70, 100]
        default:
            throw new Error(`box_type must be 0|1|2`)
    }
}
const GetSum = (array: number[]) => {
    return array.reduce((sum, item) => sum + item, 0)
}
// generate box quantity n1,n2,n3
const GetQuantityBox = (address: string, buybox_blockHash: string, boxId: number, box_type: number): number[] => {
    
    const rune_quantities: number[] = []
    let bound_number_arr: number[] = GetBoundNumberByType(box_type);
    for (let turn = 0; turn < 3; turn++) {
        const last_rune_quantity = rune_quantities[turn - 1] || 0
        const seed = SeedGenerator({ address, blockHash: buybox_blockHash, boxId, turn }, last_rune_quantity)
        const max_mod = bound_number_arr[turn] - GetSum(rune_quantities);
        rune_quantities[turn] = GetIntBySeed(seed, max_mod)
    }
    return rune_quantities
}

function GetIntBySeed(seed: string, max_mod: number) {
    let rd_num = new Decimal(`0x` + seed).mod(max_mod).toNumber() + 1;
    return rd_num;
}

// result dynamic runes
function SelectRunes(items: string[], percentage: number[], address: string, unbox_blockhash: string, boxId: number, turn: number): string {
    const RD_MAX = 1e6
    const seed = SeedGenerator({ address, blockHash: unbox_blockhash, boxId, turn })
    let rdNumber: number = GetIntBySeed(seed, RD_MAX) / RD_MAX;
    let w: number[] = [...percentage];
    for (let j = 1; j < 11; j++)
        w[j] = w[j - 1] + percentage[j];
    let i = 0;
    w[11] = 1;
    for (i; i < w.length; i++)
        if (w[i] >= rdNumber)
            break;

    return items[i];
}
const GetInitBoxItemData = (box_type: number) => {
    switch (box_type) {
        case BOX_TYPE.Gold:
            return {
                box_weight: [...G_WEIGHT],
                init_prob: [...GOLDEN_INT_PROB]
            }
        case BOX_TYPE.Platinum:
            return {
                box_weight: [...P_WEIGHT],
                init_prob: [...PLATINUM_INIT_PROB]
            }
        case BOX_TYPE.Diamond:
            return {
                box_weight: [...D_WEIGHT],
                init_prob: [...DIAMOND_INIT_PROB]
            }
        default:
            return {
                box_weight: [...G_WEIGHT],
                init_prob: [...GOLDEN_INT_PROB]
            }
    }
}

const RoundProbs = (new_probs: number[], digit: number) => {
    return new_probs.map(prob => Number(prob.toFixed(6)))
}

// Generate dynamic probs + return Items
let probs: any = {}
// Generate dynamic probs + return Items
function GetBoxItem(n: number, address: string, unbox_blockhash: string, boxId: number, turn: number, box_type: number): string {
    const { box_weight, init_prob } = GetInitBoxItemData(box_type)
    const key = `${n}_${box_type}`
    if (n < 1) throw new Error(`invalid number`);
    if (n === 1) return SelectRunes(RUNE_NAMES, init_prob, address, unbox_blockhash, boxId, turn);
    if (probs[key]) return SelectRunes(RUNE_NAMES, probs[key], address, unbox_blockhash, boxId, turn);
    let cum_sum = 0;
    let new_probs: number[] = [...init_prob];
    // console.log(`after with n= ${n}, type= ${BOX_TYPE[box_type]}`)
    // console.table({ new_probs })
    let index_weight = 0
    for (let weight of box_weight) {
        cum_sum += weight;
        if (cum_sum - weight < n && n <= cum_sum) {
            let remain_w = (index_weight === TOTAL_RUNE_TYPE - 1) ? 0 : (cum_sum - n)
            let cum_probs = 0;
            let multi_probs = 0;
            let index_prob = 0
            for (let prob of init_prob) {
                if (index_prob < index_weight) {
                    cum_probs = Math.max(...new_probs.slice(0, index_prob + 1));
                    new_probs[index_prob] = 0;
                } else if (index_prob === index_weight && index_weight < TOTAL_RUNE_TYPE - 1) {
                    multi_probs = (remain_w === 0) ? Math.max(...new_probs.slice(0, index_prob + 1)) : (init_prob[index_prob] - cum_probs) * (weight - remain_w) / weight + cum_probs
                    new_probs[index_prob] = (remain_w === 0) ? 0 : prob - multi_probs;
                } else if (index_prob > index_weight && index_prob < TOTAL_RUNE_TYPE - 1) {
                    new_probs[index_prob] = prob - multi_probs;
                } else {
                    new_probs[index_prob] = 1 - GetSum(new_probs.slice(0, TOTAL_RUNE_TYPE - 1));
                }
                index_prob++
            }
        }
        index_weight++
    }
    // console.log("before")
    new_probs = RoundProbs(new_probs, 6)
    // console.table({new_probs})
    probs[key] = new_probs
    return SelectRunes(RUNE_NAMES, new_probs, address, unbox_blockhash, boxId, turn);
}

export function OpenBox(address: string, unbox_blockhash: string, buybox_blockHash: string, boxId: number, box_type: number) {
    let box_name = BOX_TYPE[box_type]
    let [n1, n2, n3] = GetQuantityBox(address, buybox_blockHash, boxId, box_type)
    let n1_rune = GetBoxItem(n1, address, unbox_blockhash, boxId, 0, box_type);
    let n2_rune = GetBoxItem(n2, address, unbox_blockhash, boxId, 1, box_type);
    let n3_rune = GetBoxItem(n3, address, unbox_blockhash, boxId, 2, box_type);
    return { boxId, box_name, n1, n1_rune, n2, n2_rune, n3, n3_rune };
}