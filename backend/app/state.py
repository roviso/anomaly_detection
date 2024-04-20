class SharedState:
    def __init__(self, one_hot_encoder=None, train_df=None):
        self.one_hot_encoder = one_hot_encoder
        self.train_df = train_df