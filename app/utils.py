from collections import defaultdict


def group_by(elements, f):
    elements_by_key = defaultdict(list)
    for element in elements:
        elements_by_key[f(element)].append(element)

    sorted_keys = sorted(elements_by_key.keys())

    return [(key, elements_by_key[key]) for key in sorted_keys]
