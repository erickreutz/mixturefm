class Admin::MixCollectionsController < Admin::BaseController
  before_filter :find_mix_collection, only: [:edit, :update, :show]

  def index
    @mix_collections = MixCollection.paginate(page: params[:page])
  end

  def show; end

  def edit; end

  def update
    @mix_collection.assign_attributes params[:mix_collection], as: :admin
    if @mix_collection.save
      redirect_to admin_mix_collection_path(@mix_collection), notice: 'Mix Collection updated.'
    else
      render 'edit'
    end
  end

  def new
    @mix_collection = MixCollection.new
  end

  def create
    @mix_collection = MixCollection.new params[:mix_collection], as: :admin
    if @mix_collection.save
      redirect_to admin_mix_collection_path(@mix_collection), notice: 'Mix Collection created.'
    else
      render 'new'
    end
  end

  private

  def find_mix_collection
    @mix_collection = MixCollection.find_by_slug(params[:id]) || not_found
  rescue Mongoid::Errors::DocumentNotFound, BSON::InvalidObjectId
    not_found
  end
end
