import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { singleIngredient, usedIngredient } from '../FoodMealEditPage'
import { useParams } from 'react-router-dom'
import { calculateConversion } from '../../../../services/MeasurementConverter'



interface ModalProps {
    ingredient: singleIngredient,
    onClose: () => void,
    handleAddingIngredient: (usedIngredient: usedIngredient) => void
}

function SelectedIngredientModal({ ingredient, onClose, handleAddingIngredient }: ModalProps) {

    const { id } = useParams()
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [measuringMethod, setMeasuringMethod] = useState<string | undefined>()
    const [displayMeasuringMethod, setDisplayMeasuringMethod] = useState<boolean>(true)
    const [ingredientToAdd, setIngredientToAdd] = useState<usedIngredient>(
        {
            rawIngredientId: ingredient.id,
            name: ingredient.name, quantityUsed: undefined,
            measuringMethod: undefined,
            measuringUnit: undefined,
            FoodMealId: id || '',
            totalCalories: undefined,
            totalProteinGrams: undefined
        })

    useEffect(() => { if (ingredient) dialogRef.current?.showModal(); }, [ingredient])

    function provideCorrectMeasureMethod() {
        switch (measuringMethod) {
            case "weight": return <div>
                <h3> Measurement By Weight </h3>
                <fieldset onChange={handleMeasuringUnitChange}>
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
                            <input type="radio" id="gramWeight" name="measuringMethod" value="gram" />
                            <label htmlFor="gramWeight">Grams</label>
                        </div>
                        <div>
                            <input type="radio" id="kiloGramWeight" name="measuringMethod" value="kilogram" />
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
                <fieldset onChange={handleMeasuringUnitChange}>
                    <div>
                        <input type="radio" id="quarterUnit" name="measuringMethod" value="quarterUnit" />
                        <label htmlFor="quarterUnit">1/4 Quarter Unit</label>
                    </div>
                    <div>
                        <input type="radio" id="halfUnit" name="measuringMethod" value="halfUnit" />
                        <label htmlFor="halfUnit">1/2 Half Unit</label>
                    </div>
                    <div>
                        <input type="radio" id="threeQuarterUnit" name="measuringMethod" value="threeQuarterUnit" />
                        <label htmlFor="threeQuarterUnit">3/4 Quarter Unit</label>
                    </div>
                    <div>
                        <input type="radio" id="wholeUnit" name="measuringMethod" value="wholeUnit" />
                        <label htmlFor="wholeUnit">Whole Unit</label>
                    </div>
                </fieldset>
                <button onClick={() => { setMeasuringMethod(undefined); setDisplayMeasuringMethod(true) }}>Back</button>
            </div>
        }
    }

    function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
        let parsedQuantity = parseInt(e.target.value)
        let conversion = calculateConversion(ingredient.unitOfMeasurement, ingredient.calories, ingredient.protein, ingredient.baseLineMeasurement, ingredientToAdd.measuringUnit, parsedQuantity)
        setIngredientToAdd(prev => ({ ...prev, quantityUsed: parsedQuantity, totalCalories: conversion.calories, totalProteinGrams: conversion.protein }))
    }

    function handleMeasuringUnitChange(event: React.FormEvent<HTMLFieldSetElement>) {
        const target = event.target as HTMLInputElement
        let conversion = calculateConversion(ingredient.unitOfMeasurement, ingredient.calories, ingredient.protein, ingredient.baseLineMeasurement, target.value, ingredientToAdd.quantityUsed)
        setIngredientToAdd(prev => ({ ...prev, measuringUnit: target.value, totalCalories: conversion.calories, totalProteinGrams: conversion.protein }))
    }



    function handleMeasureMethodSelection(selection: (string)) {
        setMeasuringMethod(selection)
        setDisplayMeasuringMethod(false)

        if (selection === "unit") setIngredientToAdd(prev => ({ ...prev, measuringMethod: selection, quantityUsed: 1 }))
        else setIngredientToAdd(prev => ({ ...prev, measuringMethod: selection }));
    }


    const canAddIngredient = ingredientToAdd.measuringMethod != undefined && ingredientToAdd.quantityUsed != undefined

    console.log(ingredient)

    return createPortal(
        <dialog ref={dialogRef} onClose={onClose} role='dialog'>
            <h2>Selected Ingredient: {ingredient.name}</h2>
            <div className='flex'>
                <div>
                    <p>BaseLine Per {ingredient.baseLineMeasurement} {ingredient.unitOfMeasurement}</p>
                    <p>{ingredient.calories} Calories</p>
                    <p>{ingredient.protein} Grams of Protein</p>
                </div>

                <div>
                    <p>Conversion to Meal Quantity</p>
                    <p>Calories: {ingredientToAdd.totalCalories?.toFixed(2) || 0.00}</p>
                    <p>Protein: {ingredientToAdd.totalProteinGrams?.toFixed(2) || 0.00} grams</p>
                </div>
            </div>

            <form>
                {measuringMethod && <>
                    <label htmlFor="quantity">Quantity Used</label>
                    <input type="number" name="quantity" id="quantity" min={0} value={ingredientToAdd.quantityUsed} onChange={(e) => handleQuantityChange(e)} />
                </>}

                {displayMeasuringMethod &&
                    <div>
                        <button type="button" onClick={() => handleMeasureMethodSelection('weight')}>Weight</button>
                        <button type="button" onClick={() => handleMeasureMethodSelection("volume")}>Volume</button>
                        <button type="button" onClick={() => handleMeasureMethodSelection("unit")}>Count</button>
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

