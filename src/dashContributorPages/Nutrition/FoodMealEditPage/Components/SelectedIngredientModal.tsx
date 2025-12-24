import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { singleIngredient, usedIngredient } from '../FoodMealEditPage'
import { apiSlice } from '../../../../AppRedux/api/apiSlice'
import { store } from '../../../../AppRedux/store'
import { foodGroupApiSlice } from '../../../../features/FoodGroups/foodGroupSliceApi'



interface ModalProps {
    ingredient: singleIngredient,
    onClose: () => void,
    handleAddingIngredient: (usedIngredient: usedIngredient) => void
}

function SelectedIngredientModal({ ingredient, onClose, handleAddingIngredient }: ModalProps) {

    const dialogRef = useRef<HTMLDialogElement>(null)
    const [measuringMethod, setMeasuringMethod] = useState<string | undefined>(undefined)
    const [displayMeasuringMethod, setDisplayMeasuringMethod] = useState<boolean>(true)
    const [ingredientToAdd, setIngredientToAdd] = useState<usedIngredient>({ id: ingredient.id, name: ingredient.name, quantityUsed: undefined, measuringMethod: undefined })

    useEffect(() => { if (ingredient) dialogRef.current?.showModal(); }, [ingredient])

    function provideCorrectMeasureMethod() {
        switch (measuringMethod) {
            case "weight": return <div>
                <h3> Measurement By Weight </h3>
                <fieldset onChange={handleMeasuringMethodChange}>
                    <div>
                        <p>US Custom</p>
                        <div>
                            <input type="radio" id="ounceWeight" name="measuringMethod" value="ounce" />
                            <label htmlFor="ounceWeight">Ounces</label>
                        </div>
                        <div>
                            <input type="radio" id="poundWeight" name="measuringMethod" value="pound" />
                            <label htmlFor="poundWeight">Pounds (lb)</label>
                        </div>
                    </div>

                    <div>
                        <p>Metric Units</p>
                        <div>
                            <input type="radio" id="gramWeight" name="measuringMethod" value="grams" />
                            <label htmlFor="gramWeight">Grams</label>
                        </div>
                        <div>
                            <input type="radio" id="kiloGramWeight" name="measuringMethod" value="kiloGrams" />
                            <label htmlFor="kiloGramWeight">kiloGrams</label>
                        </div>
                    </div>
                </fieldset>
                <button onClick={() => { setMeasuringMethod(undefined); setDisplayMeasuringMethod(true) }}>Back</button>
            </div>;
            case "volume": return <div>
                <h3> Measurement By Volume </h3>
                <fieldset onChange={handleMeasuringMethodChange}>
                    <div>
                        <p>US Custom</p>
                        <div>
                            <input type="radio" id="cupVolume" name="measuringMethod" value="cup" />
                            <label htmlFor="cupVolume">Cups</label>
                        </div>
                        <div>
                            <input type="radio" id="pintVolume" name="measuringMethod" value="pint" />
                            <label htmlFor="pintVolume">Pints</label>
                        </div>
                        <div>
                            <input type="radio" id="quartVolume" name="measuringMethod" value="quart" />
                            <label htmlFor="quartVolume">Quarts</label>
                        </div>
                        <div>
                            <input type="radio" id="gallonVolume" name="measuringMethod" value="gallon" />
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
                <fieldset onChange={handleMeasuringMethodChange}>
                    <div>
                        <input type="radio" id="quarterUnit" name="measuringMethod" value="cup" />
                        <label htmlFor="quarterUnit">1/4 Quarter Unit</label>
                    </div>
                    <div>
                        <input type="radio" id="halfUnit" name="measuringMethod" value="cup" />
                        <label htmlFor="halfUnit">1/2 Half Unit</label>
                    </div>
                    <div>
                        <input type="radio" id="threeQuarterUnit" name="measuringMethod" value="cup" />
                        <label htmlFor="threeQuarterUnit">3/4 Quarter Unit</label>
                    </div>
                    <div>
                        <input type="radio" id="wholeUnit" name="measuringMethod" value="cup" />
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

    function handleMeasuringMethodChange(event: React.FormEvent<HTMLFieldSetElement>) {
        const target = event.target as HTMLInputElement
        setIngredientToAdd(prev => ({ ...prev, measuringMethod: target.value }))
    }

    function handleMeasuringMethodUnitSelect() {
        setIngredientToAdd(prev => ({ ...prev, quantityUsed: 1 }))
        setMeasuringMethod("unit");
        setDisplayMeasuringMethod(false)
    }



    const canAddIngredient = ingredientToAdd.measuringMethod != undefined && ingredientToAdd.quantityUsed != undefined

    return createPortal(
        <dialog ref={dialogRef} onClose={onClose} role='dialog'>
            <h2>               Selected Ingredient    </h2>
            {ingredient.name}
            <form>
                {measuringMethod && <>
                    <label htmlFor="quantity">Quantity Used</label>
                    <input type="text" name="quantity" id="quantity" min={0} value={ingredientToAdd.quantityUsed} onChange={(e) => handleQuantityChange(e)} />
                </>}

                {displayMeasuringMethod &&
                    <div>
                        <button type="button" onClick={() => { setMeasuringMethod("weight"); setDisplayMeasuringMethod(false) }}>Weight</button>
                        <button type="button" onClick={() => { setMeasuringMethod("volume"); setDisplayMeasuringMethod(false) }}>Volume</button>
                        <button type="button" onClick={() => handleMeasuringMethodUnitSelect()}>Count</button>
                    </div>}

                {measuringMethod && provideCorrectMeasureMethod()}
            </form>

            <button onClick={() => { handleAddingIngredient(ingredientToAdd); dialogRef.current?.close() }} disabled={!canAddIngredient}>Add Selected Ingredient</button>

            <button onClick={() => dialogRef.current?.close()}>Cancel</button>
        </dialog>,
        document.body
    )
}


export default SelectedIngredientModal

