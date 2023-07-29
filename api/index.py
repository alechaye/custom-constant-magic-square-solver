from fastapi import FastAPI
from constraint import *
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()


class IFormInput(BaseModel):
    variables: List[Optional[int]]
    sumConstants: List[int]


@app.post("/api/python")
async def calculate(input_data: IFormInput):
    print(input_data)

    variables = input_data.variables
    sumConstants = input_data.sumConstants

    problem = Problem()
    available_variables = get_null_indices(variables)
    available_values = get_values_from_1_to_16_that_are_not_in_a_list(
        variables)
    problem.addVariables(available_variables, available_values)
    problem.addConstraint(AllDifferentConstraint(), available_variables)

    for i, sumConstant in enumerate(sumConstants[:4]):
        index_list = []
        final_value = sumConstant
        if all(variables[4*i + j] is not None for j in range(4)):
            continue

        for j in range(4*i, 4*i+4):
            if variables[j] is None:
                index_list.append(j)
            else:
                final_value -= variables[j]

        problem.addConstraint(ExactSumConstraint(final_value), index_list)

    for i, sumConstant in enumerate(sumConstants[4:8]):
        index_list = []
        final_value = sumConstant
        if all(variables[i + j] is not None for j in range(0, 16, 4)):
            continue

        for j in range(i, 16, 4):
            if variables[j] is None:
                index_list.append(j)
            else:
                final_value -= variables[j]

        problem.addConstraint(ExactSumConstraint(final_value), index_list)

    solution = problem.getSolutions()

    return solution


def get_null_indices(lst):
    return [i for i, x in enumerate(lst) if x is None]


def get_values_from_1_to_16_that_are_not_in_a_list(lst):
    numbers_from_1_to_16_set = set(range(1, 17))
    missing_numbers = list(numbers_from_1_to_16_set - set(lst))
    return sorted(missing_numbers)
