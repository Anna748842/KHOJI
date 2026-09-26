
    from ranking import rank_items

    players = [ 
        {"name": "Alice", "score": 95},
        {"name": "Bob", "score": 95},
        {"name": "Charlie", "score": 88},
    ]

    results = rank_items(players, score_key="score")

    for result in results:
        print(result)
"""

from __future__ import annotations

from typing import Any, Callable, Iterable, TypeVar

T = TypeVar("T")


def rank_items(
    items: Iterable[T],
    *,
    score_key: str | None = None,
    score_fn: Callable[[T], float] | None = None,
    descending: bool = True,
    tie_method: str = "competition",
) -> list[dict[str, Any]]:
    """
    Rank items by score.

    Args:
        items: Items to rank.
        score_key: Dictionary key or object attribute containing the score.
        score_fn: Function that returns a numeric score for each item.
        descending: If True, highest score receives rank 1.
        tie_method:
            - "competition": 1, 1, 3
            - "dense":       1, 1, 2
            - "ordinal":     1, 2, 3

    Returns:
        A list of dictionaries containing item, score, and rank.

    Raises:
        ValueError: If the score source or tie method is invalid.
    """

    if score_key is None and score_fn is None:
        raise ValueError("Provide either score_key or score_fn.")

    if score_key is not None and score_fn is not None:
        raise ValueError("Provide only one of score_key or score_fn.")

    valid_tie_methods = {"competition", "dense", "ordinal"}
    if tie_method not in valid_tie_methods:
        raise ValueError(
            f"tie_method must be one of: {', '.join(valid_tie_methods)}"
        )

    def get_score(item: T) -> float:
        if score_fn is not None:
            score = score_fn(item)
        elif isinstance(item, dict):
            if score_key not in item:
                raise KeyError(f"Missing score key: {score_key}")
            score = item[score_key]
        else:
            if not hasattr(item, score_key):
                raise AttributeError(f"Item has no attribute: {score_key}")
            score = getattr(item, score_key)

        if not isinstance(score, (int, float)):
            raise TypeError(f"Score must be numeric, got {type(score).__name__}")

        return float(score)

    scored_items = [
        {
            "item": item,
            "score": get_score(item),
            "original_index": index,
        }
        for index, item in enumerate(items)
    ]

    scored_items.sort(
        key=lambda entry: entry["score"],
        reverse=descending,
    )

    previous_score: float | None = None
    current_rank = 0
    dense_rank = 0

    for index, entry in enumerate(scored_items):
        score = entry["score"]

        if previous_score is None or score != previous_score:
            if tie_method == "competition":
                current_rank = index + 1
            elif tie_method == "dense":
                dense_rank += 1
                current_rank = dense_rank
            elif tie_method == "ordinal":
                current_rank = index + 1

        entry["rank"] = current_rank
        previous_score = score

    return [
        {
            "rank": entry["rank"],
            "item": entry["item"],
            "score": entry["score"],
        }
        for entry in scored_items
    ]


if __name__ == "__main__":
    players = [
        {"name": "Alice", "score": 95},
        {"name": "Bob", "score": 95},
        {"name": "Charlie", "score": 88},
        {"name": "Diana", "score": 76},
    ]

    rankings = rank_items(
        players,
        score_key="score",
        tie_method="competition",
    )

    for result in rankings:
        player = result["item"]
        print(
            f"{result['rank']}. "
            f"{player['name']} - {result['score']:.0f}"
        )