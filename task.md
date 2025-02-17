- product 쿼리 파라미터 적용

  - order: 데이터를 정렬합니다. 이때 order에 값을 따로 지정해 주지 않으면, 기본적으로 newest를 기본 값으로 사용하게 됩니다.
    - priceLowest: 가격 기준 오름차순 정렬
    - priceHighest: 가격 기준 내림차순 정렬
    - oldest: 생성 시간 기준 오름차순 정렬
    - newest: 생성 시간 기준 내림차순 정렬 (기본 값)
  - offset: 오프셋. 데이터 몇 개를 건너뛸 것인지 나타냅니다.
  - limit: 데이터 개수를 제한합니다.
  - category: 필터를 적용할 카테고리입니다.
    - 예를 들어 category=FASHION이라는 파라미터가 있다면 카테고리가 FASHION인 상품만 조회할 수 있습니다. 만약 category 파라미터가 없다면 카테고리에 대한 필터를 적용하지 않습니다.

- CreateProduct, PathProduct 스트럭트 정의 및 활용

  - name: 문자열, 1~60자 사이
  - description: 문자열. 옵셔널
  - category: enum, 'FASHION', 'BEAUTY', 'SPORTS', 'ELECTRONICS', 'HOME_INTERIOR', 'HOUSEHOLD_SUPPLIES', 'KITCHENWARE' 중 하나
  - price: 숫자, 0 이상
  - stock: 정수, 0 이상
  - PatchProduct는 CreateProduct의 일부

- POST products, PATCH product API 적용

- 관련 객체 조회

1. GET /orders/:id에서 Order와 관련된 OrderItem도 모두 조회
2. 특정 유저의 Order를 모두 조회할 수 있는 GET /users/:id/orders 유저 정보는 조회할 필요 없고, 유저의 Order만 모두 조회
