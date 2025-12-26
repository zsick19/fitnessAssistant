import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { singleIngredient, usedIngredient } from '../FoodMealEditPage'



interface ModalProps {
    ingredient: usedIngredient,
    onClose: () => void,
    handleUpdatingIngredient: (usedIngredient: usedIngredient) => void
}

function EditSelectedIngredientModal({ ingredient, onClose, handleUpdatingIngredient }: ModalProps) {

    const dialogRef = useRef<HTMLDialogElement>(null)
    const [measuringMethod, setMeasuringMethod] = useState<string | undefined>(ingredient.measuringMethod)
    const [measuringUnit, setMeasuringUnit] = useState<string | undefined>(ingredient.measuringMethod)
    const [displayMeasuringMethod, setDisplayMeasuringMethod] = useState<boolean>(false)

    const [ingredientToAdd, setIngredientToAdd] = useState<usedIngredient>(ingredient)

    useEffect(() => { if (ingredient) dialogRef.current?.showModal(); }, [ingredient])

    function provideCorrectMeasureMethod() {
        switch (measuringMethod) {
            case "weight": return <div>
                <h3> Measurement By Weight </h3>
                <fieldset onChange={handleMeasuringUnitChange}>
                    <div>
                        <p>US Custom</p>
                        <div>
                            <input type="radio" id="ounceWeight" name="measuringMethod" value="ounce" checked={ingredientToAdd.measuringUnit === 'ounce'} />
                            <label htmlFor="ounceWeight">Ounces</label>
                        </div>
                        <div>
                            <input type="radio" id="poundWeight" name="measuringMethod" value="pound" checked={ingredientToAdd.measuringUnit === 'pound'} />
                            <label htmlFor="poundWeight">Pounds (lb)</label>
                        </div>
                    </div>

                    <div>
                        <p>Metric Units</p>
                        <div>
                            <input type="radio" id="gramWeight" name="measuringMethod" value="grams" checked={ingredientToAdd.measuringUnit === 'grams'} />
                            <label htmlFor="gramWeight">Grams</label>
                        </div>
                        <div>
                            <input type="radio" id="kiloGramWeight" name="measuringMethod" value="kiloGrams" checked={ingredientToAdd.measuringUnit === 'kiloGrams'} />
                            <label htmlFor="kiloGramWeight">kiloGrams</label>
                        </div>
                    </div>
                </fieldset>
                <button onClick={() => { setMeasuringMethod(undefined); setDisplayMeasuringMethod(true) }}>Back</button>
            </div>;
            case "volume": return <div>
                <h3> Measurement By Volume </h3>
                <fieldset onChange={handleMeasuringUnitChange}>
                    <div>
                        <p>US Custom</p>
                        <div>
                            <input type="radio" id="cupVolume" name="measuringMethod" value="cup" checked={ingredientToAdd.measuringUnit === 'cup'} />
                            <label htmlFor="cupVolume">Cups</label>
                        </div>
                        <div>
                            <input type="radio" id="pintVolume" name="measuringMethod" value="pint" checked={ingredientToAdd.measuringUnit === 'pint'} />
                            <label htmlFor="pintVolume">Pints</label>
                        </div>
                        <div>
                            <input type="radio" id="quartVolume" name="measuringMethod" value="quart" checked={ingredientToAdd.measuringUnit === 'quart'} />
                            <label htmlFor="quartVolume">Quarts</label>
                        </div>
                        <div>
                            <input type="radio" id="gallonVolume" name="measuringMethod" value="gallon" checked={ingredientToAdd.measuringUnit === 'gallon'} />
                            <label htmlFor="gallonVolume">Gallons</label>
                        </div>
                    </div>

                    <div>
                        <p>Metric Units</p>
                        <div>
                            <input type="radio" id="milliliterVolume" name="measuringMethod" value="milliliter" />
                            <label htmlFor="milliliterVolume">Milliliters</label>
                        </div>
                        <div>
                            <input type="radio" id="literVolume" name="measuringMethod" value="liter" />
                            <label htmlFor="literVolume">Liters</label>
                        </div>
                    </div>
                </fieldset>
                <button onClick={() => { setMeasuringMethod(undefined); setDisplayMeasuringMethod(true) }}>Back</button>
            </div>;
            case "unit": return <div>
                <h3> Measurement By Unit </h3>
                <fieldset onChange={handleMeasuringUnitChange}>
                    <div>
                        <input type="radio" id="quarterUnit" name="measuringMethod" value="quarterUnit" checked={ingredientToAdd.measuringUnit === 'quarterUnit'} />
                        <label htmlFor="quarterUnit">1/4 Quarter Unit</label>
                    </div>
                    <div>
                        <input type="radio" id="halfUnit" name="measuringMethod" value="halfUnit" checked={ingredientToAdd.measuringUnit === 'halfUnit'} />
                        <label htmlFor="halfUnit">1/2 Half Unit</label>
                    </div>
                    <div>
                        <input type="radio" id="threeQuarterUnit" name="measuringMethod" value="threeQuarterUnit" checked={ingredientToAdd.measuringUnit === 'threeQuarterUnit'} />
                        <label htmlFor="threeQuarterUnit">3/4 Quarter Unit</label>
                    </div>
                    <div>
                        <input type="radio" id="wholeUnit" name="measuringMethod" value="wholeUnit" checked={ingredientToAdd.measuringUnit === 'wholeUnit'} />
                        <label htmlFor="wholeUnit">Whole Unit</label>
                    </div>
                </fieldset>
                <button onClick={() => { setMeasuringMethod(undefined); setDisplayMeasuringMethod(true) }}>Back</button>
            </div>
        }
    }

    function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
        let parsedQuantity = parseInt(e.target.value)
        setIngredientToAdd(prev => ({ ...prev, quantityUsed: parsedQuantity }))
    }

    function handleMeasuringUnitChange(event: React.FormEvent<HTMLFieldSetElement>) {
        const target = event.target as HTMLInputElement
        setIngredientToAdd(prev => ({ ...prev, measuringUnit: target.value }))
    }



    function handleMeasureMethodSelection(selection: (string)) {
        setMeasuringMethod(selection)
        setDisplayMeasuringMethod(false)

        if (selection === "unit") setIngredientToAdd(prev => ({ ...prev, measuringMethod: selection, quantityUsed: 1 }))
        else setIngredientToAdd(prev => ({ ...prev, measuringMethod: selection }));
    }


    const canAddIngredient = ingredientToAdd.measuringMethod != undefined && ingredientToAdd.quantityUsed != undefined

    return createPortal(
        <dialog ref={dialogRef} onClose={onClose} role='dialog'>
            <h2>Selected Ingredient To Edit: {ingredient.name}</h2>
            <form>
                {measuringMethod && <>
                    <label htmlFor="quantity">Quantity Used</label>
                    <input type="text" name="quantity" id="quantity" min={0} value={ingredientToAdd.quantityUsed} onChange={(e) => handleQuantityChange(e)} />
                </>}

                {displayMeasuringMethod &&
                    <div>
                        <button type="button" onClick={() => handleMeasureMethodSelection("weight")}>Weight</button>
                        <button type="button" onClick={() => handleMeasureMethodSelection("volume")}>Volume</button>
                        <button type="button" onClick={() => handleMeasureMethodSelection("unit")}>Count</button>
                    </div>}

                {measuringMethod && provideCorrectMeasureMethod()}
            </form>

            <button onClick={() => { handleUpdatingIngredient(ingredientToAdd); dialogRef.current?.close() }} disabled={!canAddIngredient}>Update Selected Ingredient</button>

            <button onClick={() => dialogRef.current?.close()}>Cancel</button>
        </dialog>,
        document.body
    )
}


export default EditSelectedIngredientModal

